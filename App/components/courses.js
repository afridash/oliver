import React, {Component} from 'react'
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  AsyncStorage,
  RefreshControl,
  TouchableHighlight,
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
      name:'',
      code:'',
        data:[],
        refreshing: false,
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    var collegeId = await AsyncStorage.getItem('collegeId')
    this.setState({userId:key, collegeId:collegeId})
    this.retrieveCoursesOffline()
  }
  async retrieveCoursesOffline () {
    var courses = []
    var stored = await AsyncStorage.getItem("courses")
    if (stored !== null) courses = JSON.parse(stored)
    if (courses.length === 0 || courses === null) {
      console.log('Reading from online DB')
      this.retrieveCoursesOnline()
    }else{
      console.log('Retrieving from AsyncStorage')
      this.data = courses
      this.setState({data:courses})
    }
  }
  retrieveCoursesOnline () {
    this.data = []
    this.setState({courses:[], refreshing:true})
    firebase.database().ref().child('faculties').child(this.state.collegeId).once('value', (snapshots)=>{
      snapshots.forEach((childSnap)=>{
        firebase.database().ref().child('departments').child(childSnap.key).once('value', (snapshot)=>{
          snapshot.forEach((department)=>{
            firebase.database().ref().child('courses').child(department.key).once('value', (snap)=>{
              snap.forEach((course)=>{
                this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code})
                this.setState({data:this.data, refreshing:false})
                AsyncStorage.setItem('courses', JSON.stringify(this.data))
              })
            })
          })
        })
      })
    })
  }

  writeAddCourses(item) {
  firebase.database().ref().child('user_courses').child(this.state.userId).child(item.key).set({
    name:item.name,
    code:item.code,
  });
  Alert.alert(item.name, 'has been added to your list')
 //console.log(this.state.code)
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
    ><TouchableHighlight onPress={()=>this._onPressItem(index)} style={{flex:1}}>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={[customStyles.listText, styles.textColor]}> {item.name} ({item.code})</Text>
          {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
        </TouchableHighlight>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text onPress={()=>this.writeAddCourses(item)} style={[customStyles.actions, styles.textColor]}>Add To My Courses</Text>
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
                refreshControl={
                 <RefreshControl
                 refreshing={this.state.refreshing}
                    onRefresh={this.retrieveCoursesOnline.bind(this)}
          />
        }
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
