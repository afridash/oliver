import React, {Component} from 'react'
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
import NavBar from './navBar'
const firebase = require('firebase')

export default class Courses extends Component {
  constructor (props) {
    super (props)
    this.state = {
        data:[]
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
  }
  componentWillMount () {
    theme.setRoot(this)
    firebase.database().ref().child('courses').once('value', (snapshot)=>{
      snapshot.forEach((childSnap)=>{
        childSnap.forEach((course)=>{
          console.log(course.val())
          this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code})
          this.setState({data:this.data})
        })
      })
    })
  }
  searchcourses (text) {
    var clone = this.data
    this.result = clone.filter ((course) => { return course.name.toLowerCase().includes(text.toLowerCase()) === true})
    this.setState({data:this.result})
  }
  renderHeader () {
    return  (
      <View style={customStyles.inputContainer} >
        <TextInput
          style={customStyles.input}
          placeholder='Filter by course title or course code'
          onChangeText={(text) => { this.searchcourses(text) }}
        />
      </View>
    )
  }
  _onPressItem (index) {
    var clone = this.state.data
    clone[index].show = !clone[index].show
    this.setState({data:clone})
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}> {item.name} ({item.code})</Text>
        {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text onPress={Actions.theory} style={[customStyles.actions, styles.textColor]}>Add To My Courses</Text>
      </View>
      <View style={customStyles.actionsContainer}>
        <Text onPress={Actions.start_exam} style={[customStyles.actions, styles.textColor]}>Practice Exam</Text>
      </View>
      </View>
    }
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='All courses' />
        <View style={styles.secondaryContainer} >
          <View style={customStyles.container}>
            <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
            <View style={{flex:6, flexDirection:'row'}}>
              <FlatList
                data={this.state.data}
                ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
                renderItem={this.renderItem}
           />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
const customStyles = StyleSheet.create({
  container:{
    flex:10,
    margin:5,
    justifyContent:'center',
    alignItems:'flex-start',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:20,
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    margin:5,
  },
  actionsContainer:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
    margin:5,
    marginLeft:20,
    marginRight:20
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color:'black',
    backgroundColor: '#fafafa',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    borderRadius: 10,
    textAlign: 'center'
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
})
