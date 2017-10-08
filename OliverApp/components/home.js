/*
*@author Richard Igbiriki & Ikuromor Ogiriki, October 2017
*/
import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  RefreshControl,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Swipeable from 'react-native-swipeable'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import NavBar from './navBar'
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {
      name:'',
      code:'',
      data:[],
      refreshing: false,
      noCourses:true,
      isLoading:true,
      status:'',
    }
    this.ref = firebase.database().ref().child('user_courses')
    this.data = this.state.data
    this.renderItem = this.renderItem.bind(this)
    this.historyRef = firebase.database().ref().child('activities')
    this.rightButtons = [
      <Text onPress={()=>this.handleSwipeClick()} style={customStyles.swipeButton}>Delete</Text>,
    ]
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    var status = await AsyncStorage.getItem('status') //Check the internet status
    this.setState({userId:key,status})
    //Determine if the user wasn't the previously signed in user
    //Download directly from online if the user just signed
    if (currentUser === key)
    this.retrieveCoursesOffline()
    else this.readAddCourses()

    this.checkUnsavedActivities()
  }
  async checkUnsavedActivities () {
    //Save activities online if there are any unsaved
    //Set to empty after uploading
    if (this.state.status === 'true') {
      var stored = await AsyncStorage.getItem("savedActivities")
      if (stored !== null && stored !== '1') {
        var saved = JSON.parse(stored)
        saved.map((course)=>{
          this.historyRef.child(this.state.userId).push(course)
        })
        AsyncStorage.setItem('savedActivities','1')
      }
    }
  }
  componentWillReceiveProps (p) {
     this._setHighScore()
  }
  async _setHighScore () {
    await this.data.map(async (course)=>{
      course.high = await this.getHighScore(course.key)
    })
    this.setState({questions:this.data, noCourses:false, isLoading:false})
  }
  async retrieveCoursesOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read courses from firebase, then store them locally
    var courses = []
    var stored = await AsyncStorage.getItem("user_courses")
    if (stored !== null) courses = JSON.parse(stored)
    if (courses.length === 0 || courses === null) {
      this.readAddCourses()
    }else{
      this.data = courses
      await this.data.map(async (course)=>{
        course.high = await this.getHighScore(course.key)
      })
      this.setState({data:this.data, noCourses:false, isLoading:false})
    }
  }
  async readAddCourses() {
      /* 1. Set courses to empty before reloading online data to avoid duplicate entries
        2. Retrieve users courses from firebase and store them locally using AsyncStorage */
    this.data = []
    this.setState({refreshing:true})
    await this.ref.child(this.state.userId).once('value', (snapshot)=>{
      if (snapshot.val() === null) this.setState({refreshing:false, noCourses:true,isLoading:false})
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code})
        this.setState({data:this.data, refreshing:false,noCourses:false, isLoading:false})
         AsyncStorage.setItem('user_courses', JSON.stringify(this.data))

      })
    })
    this._setHighScore()
  }
  handleSwipeClick () {
    //Delete row that has been clicked on after swiping
    var rem = this.state.data.splice(this.state.activeRow,1)
    this.setState({data:this.state.data})
    this.ref.child(this.state.userId).child(this.state.deleteRef).remove()
  }
  handleUserBeganScrollingParentView() {
    this.swipeable.recenter();
  }
  _onPressItem (index) {
    //Update view to reflect the information on the clicked item
    var clone = this.state.data
    clone[index].show = !clone[index].show
    this.setState({data:clone})
  }
  async getHighScore (item) {
    var result
    try {
      const value = await AsyncStorage.getItem(item+'high')
      if (value !== null){
        result = value
      }else {
        result = 'Not Started'
      }
    } catch (error) {
    }
    return result
  }
   renderItem({ item, index }) {
     return (
       <View
         style={customStyles.listItem}
         >
      <Swipeable onRightActionRelease={()=>this.setState({activeRow:index, deleteRef:item.key})} rightActionActivationDistance={100} onRef={ref => this.swipeable = ref} rightButtons={this.rightButtons}>
        <TouchableHighlight underlayColor={'transparent'}  onPress={()=>this._onPressItem(index)}
          style={{flex:1}}>
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={[customStyles.listText, styles.textColor]}> {item.name} ({item.code})</Text>
            {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
          </View>
        </TouchableHighlight>
          {item.show && <View style={{flex:1}}>
            <View style={customStyles.actionsContainer}>
            <Text onPress={()=>Actions.theory({courseId:item.key, courseCode:item.code})} style={[customStyles.actions, styles.textColor]}>Study Theory Questions</Text>
          </View>
          <View style={customStyles.actionsContainer}>
            <Text onPress={()=>Actions.start_exam({courseId:item.key, courseCode:item.code, course:item.name})} style={[customStyles.actions, styles.textColor]}>Practice Exam</Text>
          </View>
          <View style={customStyles.actionsContainer}>
            <Text style={[customStyles.actions, styles.textColor]}>High Score: {item.high}</Text>
          </View>
          </View>
        }
      </Swipeable>
    </View>
      )
   }
   searchcourses (text) {
     //Search for user entry using the second variable that the courses are stored in.
     //Filter each and return those that contain the searched string
     var clone = this.data
     this.result = clone.filter ((course) => { return course.name.toLowerCase().includes(text.toLowerCase()) === true || course.code.toLowerCase().includes(text.toLowerCase()) === true })
     if (this.result.length > 0)
     this.setState({data:this.result, noSearchResult:false})
     else this.setState({noSearchResult:true})
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
   renderFlatList () {
     return (
       <FlatList
         data={this.state.data}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.readAddCourses.bind(this)}
         />
        }
    />
     )
   }
   render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <NavBar title='My Courses' />
        <View style={{flex:1}} >
          <View style={customStyles.container}>
            <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
            <View style={{flex:6, flexDirection:'row'}}>
              {(()=>{
                if (this.state.isLoading) return (
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
                )
                else if (this.state.noCourses) return (
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Click Below To Add A Course</Text></View>
                )
                else if (this.state.noSearchResult) return (
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>:( Nothing Found</Text></View>
                )
                else return this.renderFlatList()
              })()
            }
            </View>
          </View>
          <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
            <Button
              containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
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
  fontSize: 16,
  color:'black',
  backgroundColor: '#fafafa',
  fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  borderRadius: 10,
  textAlign: 'center'
  },
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  swipeButton:{
    color:'white',
    fontSize:16,
    marginLeft:20,
    backgroundColor:'#ff1744',
    overflow:'hidden',
    padding:10,
    borderRadius:10,
    borderWidth:1,
    borderColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  secondaryButton: {
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
  },
})