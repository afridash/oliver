import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  FlatList,
  Image
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import NavBar from './navBar'
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data:[{key:'1',show:false, name:"Richard Igbiriki",}, {key:'2',show:false, name:"Richard Igbiriki",}, {key:'3',show:false, name:"Richard Igbiriki",}, {key:'4',show:false, name:"Richard Igbiriki",}]
    }
    this.renderItem = this.renderItem.bind(this)
  }
  componentWillMount () {
    theme.setRoot(this)
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
      <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}>{item.key} {item.name}</Text>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text onPress={Actions.theory} style={[customStyles.actions, styles.textColor]}>Study Theory Questions</Text>
      </View>
      <View style={customStyles.actionsContainer}>
        <Text onPress={Actions.start_exam} style={[customStyles.actions, styles.textColor]}>Practice Exam</Text>
      </View>
      <View style={[customStyles.actionsContainer, {flexDirection:'row'}]}>
        <Text style={[customStyles.actions, styles.textColor]}>Bookmark</Text>
        <Image source={require('../assets/images/bookmark.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
      </View>
      </View>
    }
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <NavBar />
        <View style={{flex:1}} >
          <View style={customStyles.container}>
            <FlatList
              data={this.state.data}
              ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
              renderItem={this.renderItem}
         />
          </View>
          <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
            <Button
              containerStyle={styles.secondaryButton}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={Actions.add_course}>
              Add Course
            </Button>
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
    flexDirection:'row',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:3,
  },
  addButton : {
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
  fontSize: 12,
  backgroundColor: 'white',
  fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  borderRadius: 10,
  textAlign: 'center'
},
icon:{
  marginTop:20,
  resizeMode: 'contain',
  width: 20,
  height: 20,
  alignItems:'flex-end',
},
})
