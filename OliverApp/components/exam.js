/*
*@author Richard Igbiriki, October 2017
*/
import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  Platform,
  Image,
  Modal,
  FlatList,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native'
import {
  AdMobInterstitial,
 } from 'react-native-admob'
 import Analytics from 'react-native-firebase-analytics'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import NavBar from './navBar'
export default class Exams extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:[],
      index:0,
      title:'Course Code',
      finished:false,
      modalVisible:false,
      correct:0,
      noQuestions:false,
      isLoading:true,
      status:'',
      college:'',
      profilePicture:'',
      messages:[{key:1, message:'Want to beat my high score ?!'},
                {key:2, message:'I just finished practicing! Want to try?'},
                {key:3, message:'Hey all, check out my score!'},
                {key:4, message:'Cool! I did great! Try it'} ]
    }
    //firebase realtime db references
    this.ref = firebase.database().ref().child('questions').child(this.props.courseId)
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
    this.historyRef = firebase.database().ref().child('activities')
    this.exploreRef = firebase.database().ref().child('explore')
    this.followersRef = firebase.database().ref().child('question_followers')
    this.statsRef = firebase.database().ref().child('student_stats').child(this.props.courseId)
    this.coursesRef = firebase.database().ref().child('course_activities').child(this.props.courseId)
  }
  async componentWillMount () {
    theme.setRoot(this)
    //Retrieve user information stored locally
    await this.getInfo()
    //Retrieve locally stored images or download questions if none
    this.retrieveQuestionsOffline()
    this.saveStarted()
    Analytics.setUserId(this.state.userId)
    Analytics.setUserProperty('username', this.state.username)
    Analytics.logEvent('exam_started', {
    'user': this.state.username
  })
  }
  saveStarted () {
    //Save to number of tests started
    var ref = this.statsRef.child(this.state.userId).child('total_started').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
  }
  componentDidMount () {
    AdMobInterstitial.setTestDevices(['EMULATOR']);
    AdMobInterstitial.setAdUnitID('ca-app-pub-1090704049569053/9261698690');
  }
  async getInfo () {
    //Retrieve user from local storage
    var key = await AsyncStorage.getItem('myKey')
    var status = await AsyncStorage.getItem('status')
    var college = await AsyncStorage.getItem('collegeId')
    var username = await AsyncStorage.getItem('username')
    var profilePicture = await AsyncStorage.getItem('pPicture')
    this.setState({userId:key, status, college, profilePicture, username:username})
  }
  async downloadQuestions () {
    if (this.state.status === 'true') {
      this.data = []
      await this.ref.orderByChild('type').equalTo('objective').once('value',(snapshot)=>{
        snapshot.forEach((snap)=>{
          if (snap.val().answered) {
            var answer
            if (snap.val().answer.toUpperCase() === 'A') answer = snap.val().optionA
            else if (snap.val().answer.toUpperCase() === 'B') answer = snap.val().optionB
            else if (snap.val().answer.toUpperCase() === 'C') answer = snap.val().optionC
            else answer = snap.val().optionD
            this.data.push({key:snap.key,
              question:snap.val().question,
              optionA:snap.val().optionA, optionB:snap.val().optionB,
              optionC:snap.val().optionC, optionD:snap.val().optionD, selected:'',
              answer:snap.val().answer.toUpperCase(), show:false,textAnswer:answer})
            AsyncStorage.setItem(this.props.courseId+'obj', JSON.stringify(this.data))
          }
        })
      })
    }
  }
  async retrieveQuestionsOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read questions from firebase, then store them locally
    var questions = []
    var stored = await AsyncStorage.getItem(this.props.courseId+'obj')
    if (stored !== null) questions = JSON.parse(stored)
    if (questions.length === 0 || questions === null) {
      this.retrieveQuestionsOnline ()
    }else{
      this.data = questions
      this.setState({questions:questions, noQuestions:false,isLoading:false,})
      this.randomizeQuestions()
      this.downloadQuestions()
    }
  }
  async retrieveQuestionsOnline () {
    /*
    * Retrieve questions from firebase based on type -- objective
    * Toggle between downloading, and no questions
    * Store them locally for offline usage
    */
    this.data = []
    await this.ref.orderByChild('type').equalTo('objective').once('value',(snapshot)=>{
      if (snapshot.val()  === null ) this.setState({noQuestions:true,isLoading:false})
      snapshot.forEach((snap)=>{
        if (snap.val().answered) {
          if (snap.val().answer.toUpperCase() === 'A') answer = snap.val().optionA
          else if (snap.val().answer.toUpperCase() === 'B') answer = snap.val().optionB
          else if (snap.val().answer.toUpperCase() === 'C') answer = snap.val().optionC
          else answer = snap.val().optionD
          this.data.push({key:snap.key, question:snap.val().question, optionA:snap.val().optionA, optionB:snap.val().optionB,
            optionC:snap.val().optionC, optionD:snap.val().optionD, selected:'', answer:snap.val().answer.toUpperCase(), show:false,
            textAnswer:answer})
          this.setState({questions:this.data, noQuestions:false,isLoading:false})
          AsyncStorage.setItem(this.props.courseId+'obj', JSON.stringify(this.data))
        }
      })
    })
    this.randomizeQuestions()
  }
  randomizeQuestions () {
    /*
    * Determine if there are more than 50 questions, set max num to 50, or set max num to questions.length
    * Set the maximum number to generate a random number to questions.length
    * Iterate over questions to select a random item, add it to questions, and increment counter
    * If counter equals maxQuestions, break and set questions
    */
    var maxQuestions
    if (this.state.questions.length > 20) maxQuestions = 20
    else maxQuestions = this.state.questions.length
    var num2 = this.state.questions.length //Max num to generate random questions
    var objsArray = []
    this.questions = []
    var i=0
    while (true) {
      if (i===maxQuestions) break
        var item = this.state.questions[Math.floor(Math.random()*num2)]; //Select random item from the questions
        if (!objsArray[item.key]) { //Confirm if it has not been selecte before
          this.questions.push(item) //Store the question
          objsArray[item.key] = 1
          i +=1 //Increment number of uniquely selected elements
        }
    }
    this.setState({questions:this.questions, total:maxQuestions})
  }
  restart () {
    this.setState({index:0, finished:false,correct:0})
    this.retrieveQuestionsOffline()
  }
  selectOption (option, text) {
    /*
    * Determine if the selected option is right (increase the score)
    * Determine if the selected option is the wrong answer after a correct option has been previously selected (decrease the score)
    * Update the UI with the selected option
    */
    var clone = this.state.questions
    if (option !== clone[this.state.index].selected && option === clone[this.state.index].answer.trim() )
    this.setState({correct:this.state.correct + 1})
    else if (clone[this.state.index].selected === clone[this.state.index].answer && option !== clone[this.state.index].answer )
    this.setState({correct:this.state.correct - 1})
    clone[this.state.index].textSelected = text
    clone[this.state.index].selected = option
    this.setState({questions:clone})
  }
  showNextQuestion () {
    //Determine if going forward is possible (increase the index), else exam has concluded
    if (this.state.index < this.state.questions.length - 1)
    this.setState({index:this.state.index + 1})
    else {
      this._saveHigh()
      this._saveToHistory()
      this.setState(prevState =>({finished:!prevState.finished}))
    }
  }
  _saveToHistory (){
      AdMobInterstitial.requestAd().then(function(){
         AdMobInterstitial.showAd()
      }).catch((e)=>{
      });
    var data = {
      title:this.props.course,
      code:this.props.courseCode,
      createdAt:firebase.database.ServerValue.TIMESTAMP,
      score:this.state.correct,
      total:this.state.total,
      percentage:(this.state.correct/this.state.total * 100).toFixed(2)
    }
    if (this.state.status === 'true') {
        var item = this.historyRef.child(this.state.userId).push()
        item.setWithPriority(data, 0 - Date.now())
        var activity = this.coursesRef.child(this.state.userId).push()
        activity.setWithPriority(data, 0 - Date.now())
        this.saveCompleted()
    }else {
      this._saveActivities(data)
    }
    this.setState({percentage:(this.state.correct/this.state.total * 100).toFixed(2)})
  }
  saveCompleted () {
    //Save to number of tests completed
    var ref = this.statsRef.child(this.state.userId).child('total_completed').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
  }
  async _saveActivities (data) {
    data[courseId] = this.props.courseId
    var previous = await AsyncStorage.getItem('savedActivities')
    if (previous !== null && previous !== '1') {
      previous = JSON.parse(previous)
      previous.push(data)
      AsyncStorage.setItem('savedActivities', JSON.stringify(previous))
    }else{
      var newActivity = []
      newActivity.push(data)
       AsyncStorage.setItem('savedActivities',JSON.stringify(newActivity))
    }
  }
  async _saveHigh () {
    //Determine if the user already has a high score, override it--if it is below the current score
    //Save the current score if there is no current high score
    var score = await AsyncStorage.getItem(this.props.courseId+'high')
    if (score === null) AsyncStorage.setItem(this.props.courseId+'high',this.state.correct.toString())
    else {
      if (score < this.state.correct) AsyncStorage.setItem(this.props.courseId+'high',this.state.correct.toString())
    }
  }
  showPrevQuestion () {
    //Determine if going backward is possible (decrease the index), else exam has concluded
    if (this.state.index > 0)
    this.setState({index:this.state.index - 1})
  }
  showQuestion (){
    //Render current question at index
    var question = this.state.questions[this.state.index]
    return (
      <View style={{flex:1}}>
        <ScrollView style={{flex:1}}>
          <View style={{flex:1, flexDirection:'row', justifyContent:'center', margin:10, padding:15,}}>
            <Text style={[customStyles.question, styles.textColor]}>{question.question}</Text>
            <Button onPress={()=>this.bookmarkQuestion(question)}>
              {question.bookmark ? <Image source={require('../assets/images/bookmark.png')} style={[{width:25, height:25, margin:10, tintColor:'red'}]} resizeMode={'contain'}/>:
            <Image source={require('../assets/images/bookmark.png')} style={[styles.iconColor, {width:25, height:25, margin:10}]} resizeMode={'contain'}/>}
            </Button>
          </View>
        </ScrollView>
        <View style={{flex:2, margin:20,}}>
          <ScrollView >
            <View style={[customStyles.actionsContainer, styles.actionsContainer,{backgroundColor:question.selected === 'A' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('A', question.optionA)} style={[customStyles.actions, styles.textColor]}>{question.optionA}</Text>
          </View>
          <View style={[customStyles.actionsContainer,styles.actionsContainer, {backgroundColor:question.selected === 'B' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('B', question.optionB)} style={[customStyles.actions, styles.textColor]}>{question.optionB}</Text>
          </View>
          <View style={[customStyles.actionsContainer,styles.actionsContainer, {backgroundColor:question.selected === 'C' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('C', question.optionC)} style={[customStyles.actions, styles.textColor]}>{question.optionC}</Text>
          </View>
          <View style={[customStyles.actionsContainer, styles.actionsContainer, {backgroundColor:question.selected === 'D' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('D', question.optionD)} style={[customStyles.actions, styles.textColor]}>{question.optionD}</Text>
          </View>
          </ScrollView>
        </View>
      </View>
    )
  }
  bookmarkQuestion (question) {
    /*
    * Determine if question has been bookmarked previously, remove it, else add it to firebase
    * Negate the value of bookmarked and update the UI
    */
    if (question.bookmark) {
      this.bookmarksRef.child(this.state.userId).child(question.key).remove()
      var ref = this.statsRef.child(this.state.userId).child('total_bookmarked').once('value', (snapshot)=>{
        if (snapshot.exists()) snapshot.ref.set(snapshot.val() - 1)
      })
    }else {
      this.bookmarksRef.child(this.state.userId).child(question.key).update(question)
      var ref = this.statsRef.child(this.state.userId).child('total_bookmarked').once('value', (snapshot)=>{
        if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
        else snapshot.ref.set(1)
      })
    }
    question.bookmark = !question.bookmark
    var clone = this.state.questions
    clone[this.state.index] = question
    this.setState({questions:clone})
  }
  shareToExplore () {
    /*
    * Select a random message,
    * Get data about the user and course
    * Save too explore and alert the user
    * Go back home
    */
    var num = this.state.messages.length
    var item = this.state.messages[Math.floor(Math.random()*num)]
    var data = {
        profilePicture:this.state.profilePicture,
        username:this.state.username,
        course:this.props.course,
        courseCode:this.props.courseCode,
        courseId:this.props.courseId,
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        message: item.message,
        starCount:0,
        userId:this.state.userId,
        percentage: (this.state.correct/this.state.total * 100).toFixed(2)
    }
    var item = this.exploreRef.child(this.state.college).push()
    key = item.key
    item.setWithPriority(data, 0 - Date.now())
    this.followersRef.child(key).child(this.state.userId).set(true)
    var ref = this.statsRef.child(this.state.userId).child('explore_posts').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
    Alert.alert(
      'Shared!',
      'Thank you for sharing to explore! Kudos',
      [
        {text: 'Ok', onPress: () => Actions.pop()},
      ],
      { cancelable: false }
    )
  }
  showSummary () {
    return (
      <View style={{flex:1}}>
        <View style={{flex:0.5, margin:10, padding:10}}>
          <Text style={[customStyles.result, styles.textColor]}>Result</Text>
        </View>
        <View style={{flex:1.5, margin:20,}}>
        <Text style={[customStyles.result, styles.textColor]}>Score: {this.state.correct}/{this.state.questions.length} ({this.state.percentage})</Text>
        <View style={[customStyles.actionsContainer, styles.actionsContainer]}>
          <Text onPress={()=>this.setState({modalVisible:!this.state.modalVisible})} style={[customStyles.actions, styles.textColor]}>Show Summary</Text>
        </View>
        </View>
      </View>
    )
  }
  _keyExtractor = (item, index) => item.key
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
      >
      <Text style={[customStyles.listText, styles.textColor]}>{index+1}. {item.question}</Text>
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <View style={[customStyles.actionsContainer, styles.actionsContainer]}>
          <Text style={[customStyles.actions, styles.textColor]}>Suggested Answer: {item.textAnswer} ({item.answer})</Text>
        </View>
        <View style={[customStyles.actionsContainer,styles.actionsContainer, {borderColor:item.selected === item.answer ? '#004d40' : 'red'}]}>
          <Text style={[customStyles.actions, styles.textColor]}>Selected: {item.textSelected} ({item.selected})</Text>
        </View>
      </View>
    </View>
      )
   }
  showSummaryModal () {
    return  (
      <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View style={styles.container}>
          <View style={{flex:1, marginTop:30, borderTopLeftRadius:10,borderTopRightRadius:10, borderTopWidth:2, borderColor:'grey', overflow:'hidden', padding:5}}>
            <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-end'}}>
              <TouchableHighlight onPress={() =>
                this.setState({modalVisible:!this.state.modalVisible})}>
                <Text style={[styles.textColor,{padding:1, fontSize:20, fontFamily:'verdana'}]}>Done</Text>
              </TouchableHighlight>
            </View>
            <View style={{flex:12}}>
              <FlatList
                data={this.state.questions}
                ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  showAlert () {
    Alert.alert(
      'Confirm',
      'You are leaving us, are you sure?',
      [
        {text: 'No, Stay', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => Actions.pop()},
      ],
      { cancelable: false }
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} title={this.props.courseCode} progress={this.state.index+1 + '/' + this.state.questions.length} />
        {!this.state.finished &&
          <View style={{flex:1}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noQuestions) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}>:( No Objectives...Check Back Later</Text></View>)
              else return this.showQuestion()
            })()
          }
            <View style={[{flex:0.1,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}, styles.progress]}>
              <Button onPress={()=>this.showPrevQuestion()}  ><Image source={require('../assets/images/left.png')} style={[customStyles.icons, {tintColor:'white'}]} /></Button>
              <Button onPress={()=>this.showAlert()}><Image source={require('../assets/images/cancel.png')} style={[ {tintColor:'white'}, {width:25,height:25, padding:10}]} resizeMode={'contain'} /></Button>
              <Button onPress={()=>this.showNextQuestion()} ><Image source={require('../assets/images/right.png')} style={[customStyles.icons, {tintColor:'white'}]} /></Button>
            </View>
          </View>
        }
        {this.state.finished &&
          <View style={{flex:1}}>
            {this.showSummary()}
            <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
              <Button
                containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
                style={customStyles.addButton}
                styleDisabled={{color: 'red'}}
                onPress={()=>this.restart()}>
                Another One!
              </Button>
            </View>
            <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
              <Button
                containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
                style={customStyles.addButton}
                styleDisabled={{color: 'red'}}
                onPress={()=>Actions.pop({refresh: {done: true}})}>
                Return Home
              </Button>
              <Button
                containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
                style={customStyles.addButton}
                styleDisabled={{color: 'red'}}
                onPress={()=>this.shareToExplore()}>
                Share
              </Button>
            </View>
          </View>
        }
        {this.showSummaryModal()}
      </View>
    )
  }
}
const customStyles = {
  question:{
    fontSize:16,
    padding:10,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  actionsContainer:{
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
    margin:5,
    marginLeft:20,
    marginRight:20,
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    },
    icons:{
      margin: 10,
      resizeMode: 'contain',
      width: 40,
      height: 40,
      alignItems:'flex-end',
    },
    separator:{
      height:1,
      backgroundColor:'grey',
    },
    buttonContainer:{
      flex:0.1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      margin:5,
    },
    addButton : {
      fontSize: 20,
      color: 'white',
      fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    },
    result:{
      fontSize:30,
      fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
      padding:10,
      fontWeight:'bold',
      textAlign:'center',
    },
    listItem:{
      padding:20,
    },
    listText:{
      fontSize:18,
      fontWeight:'500',
      fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
      margin:5,
    },
    secondaryButton: {
      padding:10,
      flex:1,
      height:45,
      margin:1,
      overflow:'hidden',
      borderRadius:10,
    },
}
