/*
*@author Richard Igbiriki & Ikuromor Ogiriki, October 2017
*/
import React, {Component} from 'react'
import {
  View,
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
import Analytics from 'react-native-firebase-analytics'
import Button from 'react-native-button'
import Swipeable from 'react-native-swipeable'
import { Container, Header, Content, Card, CardItem, Body, Text, ActionSheet, Icon} from 'native-base'
import Firebase from '../auth/firebase'
import NavBar from './navBar'
const firebase = require('firebase')
var BUTTONS = [
  { text: "Delete", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {
      name:'',
      code:'',
      data:[],
      refreshing: false,
      noCourses:false,
      status:'',
      swipingStarted:false,
      verified:false,
    }
    this.ref = firebase.database().ref().child('user_courses')
    this.registeredRef = firebase.database().ref().child('registered_courses')
    this.statsRef = firebase.database().ref().child('student_stats')
    this.data = this.state.data
    this.renderItem = this.renderItem.bind(this)
    this.historyRef = firebase.database().ref().child('activities')
    this.coursesRef = firebase.database().ref().child('course_activities')
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    if (key === null) return Actions.reset('index')
    else {
      var currentUser = await AsyncStorage.getItem('currentUser')
      var username = await AsyncStorage.getItem('name')
      var status = await AsyncStorage.getItem('status') //Check the internet status
      this.setState({userId:key,status, username:username})
      //Determine if the user wasn't the previously signed in user
      //Download directly from online if the user just signed
      if (currentUser === key)
      this.retrieveCoursesOffline()
      else this.readAddCourses()

      this.checkUnsavedActivities()
      this.setAnalytics()
    }
  }
  setAnalytics () {
    Analytics.setUserId(this.state.userId)
    Analytics.setUserProperty('username', this.state.username)
    Analytics.logEvent('view_item', {
    'page_id': 'home'
    });
  }
  async checkUnsavedActivities () {
    //Save activities online if there are any unsaved
    //Set to empty after uploading
    if (this.state.status === 'true') {
      var stored = await AsyncStorage.getItem("savedActivities")
      if (stored !== null && stored !== '1') {
        var saved = JSON.parse(stored)
        saved.map((course)=>{
          var item = this.historyRef.child(this.state.userId).push()
          item.setWithPriority(course, 0 - Date.now())
          var activity = this.coursesRef.child(course.courseId).child(this.state.userId).push()
          activity.setWithPriority(data, 0 - Date.now())
        })
        AsyncStorage.setItem('savedActivities','1')
      }
    }
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
      this.checkInternetStatus()
      this.setState({data:this.data, noCourses:false, isLoading:false})
    }
  }
  async checkInternetStatus () {
    if (this.state.status === 'true') {
      this.readAddCourses()
    }
  }
  async readAddCourses() {
    this.setState({refreshing:true})
    AsyncStorage.setItem('currentUser', this.state.userId)
      /* 1. Set courses to empty before reloading online data to avoid duplicate entries
        2. Retrieve users courses from firebase and store them locally using AsyncStorage */
    this.data = []
    await this.ref.child(this.state.userId).once('value', (snapshot)=>{
      if (!snapshot.exists()) {
        AsyncStorage.setItem('user_courses', JSON.stringify([]))
        this.setState({refreshing:false, noCourses:true})
      }
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code, highest:course.val().highest})
        this.setState({data:this.data, refreshing:false,noCourses:false, isLoading:false})
         AsyncStorage.setItem('user_courses', JSON.stringify(this.data))
      })
    })
  }
  handleSwipeClick () {
    //Delete row that has been clicked on after swiping
    var rem = this.state.data.splice(this.state.activeRow,1)
    this.setState({data:this.state.data})
    AsyncStorage.setItem('user_courses', JSON.stringify(this.state.data))
    this.ref.child(this.state.userId).child(this.state.deleteRef).remove()
    this.registeredRef.child(this.state.deleteRef).child(this.state.userId).remove()
  }
  showOptions (item, index) {
    return (
          ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Delete Course"
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          await this.setState({activeRow:index})
           this.handleSwipeClick()
        }
      }
    )
   )
  }
  renderItem({ item, index }) {
     return (
       <View style={customStyles.listItem}>
          <Card>
            <CardItem>
              <Body>
                <Text style={[customStyles.listText, styles.homeTextColor]}>
                  {item.name} ({item.code})
                </Text>
              </Body>
              <Button transparent
                onPress={() => this.showOptions(item, index)}>
                <Icon name='ios-arrow-down' />
              </Button>
            </CardItem>
              <Card style={customStyles.actions}>
                <CardItem>
                  <Body>
                    <Text onPress={()=>Actions.theory({courseId:item.key, courseCode:item.code})} style={[styles.homeTextColor]}>Study Theory Questions</Text>
                  </Body>
                </CardItem>
              </Card>
            <Card style={customStyles.actions}>
              <CardItem>
                <Body>
                  <Text onPress={()=>Actions.objectives({courseId:item.key, courseCode:item.code})} style={[styles.homeTextColor]}>Study Objectives</Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={customStyles.actions}>
              <CardItem>
                <Body>
                  <Text onPress={()=>Actions.start_exam({courseId:item.key, courseCode:item.code, course:item.name})} style={[styles.homeTextColor]}>Practice Exam (High Score: {item.highest})</Text>
                </Body>
              </CardItem>
            </Card>
          </Card>
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
  bannerError = (error) => {
     //Failed to load banner
   }
  render () {
    return (
      <Container style={styles.container}>
        <NavBar title='My Courses' />
        <StatusBar
          barStyle="light-content"
        />

        <View style={{flex:1}} >
          <View style={customStyles.container}>
            <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
            <View style={{flex:6, flexDirection:'row'}}>
              {(()=>{
                  if (this.state.noCourses) return (
                  <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>
                    <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
                 <Button
                   containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
                   style={customStyles.addButton}
                   styleDisabled={{color: 'red'}}
                   onPress={Actions.add_course}>
                   Find Courses
                 </Button>
               </View>
             </View>
                )
                else if (this.state.noSearchResult) return (
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>:( Nothing Found</Text></View>
                )
                else return (
                  <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    refreshControl={
                     <RefreshControl
                     refreshing={this.state.refreshing}
                        onRefresh={()=>this.readAddCourses()}
                    />
                   }
               />
                )
              })()
            }
            </View>
          </View>
        </View>
      </Container>
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
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  listItem:{
    padding:5,
  },
  listText:{
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
  actionsContainer:{
    flex:1,
    margin:5,
    marginLeft:20,
    marginRight:20,
    padding:5
  },
  actions:{
    flex:1,
    marginLeft:10,
    marginRight:10,
    padding:5,
  },
  input: {
  height: 50,
  flex: 1,
  fontSize: 16,
  color:'black',
  backgroundColor: '#fafafa',
  fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  secondaryButton: {
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
  },
})
