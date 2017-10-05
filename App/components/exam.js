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
      isLoading:true
    }
    this.ref = firebase.database().ref().child('questions').child(this.props.courseId)
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    this.setState({userId:key})
    this.retrieveQuestionsOffline()
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
      this.setState({questions:questions, noQuestions:false,isLoading:false, total:questions.length})
    }
  }
  retrieveQuestionsOnline () {
    this.data = []
    this.ref.orderByChild('type').equalTo('objective').once('value',(snapshot)=>{
      if (snapshot.val()  === null ) this.setState({noQuestions:true,isLoading:false})
      snapshot.forEach((snap)=>{
        if (snap.val().answered) {
          this.data.push({key:snap.key, question:snap.val().question, optionA:snap.val().optionA, optionB:snap.val().optionB, optionC:snap.val().optionC, optionD:snap.val().optionD, selected:'', answer:snap.val().answer, show:false,})
          this.setState({questions:this.data, total:this.state.total+1, noQuestions:false,isLoading:false})
          AsyncStorage.setItem(this.props.courseId+'obj', JSON.stringify(this.data))
        }
      })
    })

  }
  restart () {
    this.setState({index:0, finished:false})
  }
  selectOption (option) {
    var clone = this.state.questions
    if (option !== clone[this.state.index].selected && option === clone[this.state.index].answer )
    this.setState({correct:this.state.correct + 1})
    else if (clone[this.state.index].selected === clone[this.state.index].answer && option !== clone[this.state.index].answer )
    this.setState({correct:this.state.correct - 1})
    clone[this.state.index].selected = option
    this.setState({questions:clone})
  }
  showNextQuestion () {
    if (this.state.index < this.state.questions.length - 1)
    this.setState({index:this.state.index + 1})
    else this.setState(prevState =>({finished:!prevState.finished}))
  }
  showPrevQuestion () {
    if (this.state.index > 0)
    this.setState({index:this.state.index - 1})
  }
  showQuestion (){
    var question = this.state.questions[this.state.index]
    return (
      <View style={{flex:1}}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'center', margin:10, padding:15,}}>
          <Text style={[customStyles.question, styles.textColor]}>{question.question}</Text>
          <Button onPress={()=>this.bookmarkQuestion(question)}>
            {question.bookmark ? <Image source={require('../assets/images/bookmark.png')} style={[{width:25, height:25, margin:10, tintColor:'red'}]} resizeMode={'contain'}/>:
          <Image source={require('../assets/images/bookmark.png')} style={[styles.iconColor, {width:25, height:25, margin:10}]} resizeMode={'contain'}/>}
          </Button>
        </View>
        <View style={{flex:1.5, margin:20,}}>
          <ScrollView >
            <View style={[customStyles.actionsContainer,{backgroundColor:question.selected === 'A' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('A')} style={[customStyles.actions, styles.textColor]}>{question.optionA}</Text>
          </View>
          <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'B' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('B')} style={[customStyles.actions, styles.textColor]}>{question.optionB}</Text>
          </View>
          <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'C' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('C')} style={[customStyles.actions, styles.textColor]}>{question.optionC}</Text>
          </View>
          <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'D' ? '#607d8b' : 'transparent'}]}>
            <Text onPress={()=>this.selectOption('D')} style={[customStyles.actions, styles.textColor]}>{question.optionD}</Text>
          </View>
          </ScrollView>
        </View>
      </View>
    )
  }
  bookmarkQuestion (question) {
    if (question.bookmark) {
      this.bookmarksRef.child(this.state.userId).child(question.key).remove()
    }else {
      this.bookmarksRef.child(this.state.userId).child(question.key).update(question)
    }
    question.bookmark = !question.bookmark
    var clone = this.state.questions
    clone[this.state.index] = question
    this.setState({questions:clone})
  }
  showSummary () {
    return (
      <View style={{flex:1}}>
        <View style={{flex:0.5, margin:10, padding:10}}>
          <Text style={[customStyles.result, styles.textColor]}>Result</Text>
        </View>
        <View style={{flex:1.5, margin:20,}}>
        <Text style={[customStyles.result, styles.textColor]}>Score: {this.state.correct}/{this.state.questions.length}</Text>
        <View style={[customStyles.actionsContainer]}>
          <Text onPress={()=>this.setState({modalVisible:!this.state.modalVisible})} style={[customStyles.actions, styles.textColor]}>Show Summary</Text>
        </View>
        </View>
      </View>
    )
  }
  _keyExtractor = (item, index) => item.id
  renderItem({ item, index }) {
   return (
     <View
       key={item.id}
      style={customStyles.listItem}
      >
      <Text style={[customStyles.listText, styles.textColor]}>{index+1}. {item.question}</Text>
      <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
        <View style={[customStyles.actionsContainer]}>
          <Text style={[customStyles.actions, styles.textColor]}>Suggested Answer: {item.answer}</Text>
        </View>
        <View style={[customStyles.actionsContainer, {borderColor:item.selected === item.answer ? '#004d40' : 'red'}]}>
          <Text style={[customStyles.actions, styles.textColor]}>Selected: {item.selected}</Text>
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
                <Text style={[styles.textColor,{padding:1, fontSize:20, fontFamily:'Didot'}]}>Done</Text>
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
              <Button onPress={()=>this.showPrevQuestion()}  ><Image source={require('../assets/images/left.png')} style={[customStyles.icons, styles.iconColor]} /></Button>
              <Button onPress={()=>this.showAlert()}><Image source={require('../assets/images/cancel.png')} style={[styles.iconColor, {width:25,height:25, padding:10}]} resizeMode={'contain'} /></Button>
              <Button onPress={()=>this.showNextQuestion()} ><Image source={require('../assets/images/right.png')} style={[customStyles.icons, styles.iconColor]} /></Button>
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
          </View>
        }
        {this.showSummaryModal()}
      </View>
    )
  }
}
const customStyles = {
  question:{
    fontSize:20,
    padding:10,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  actionsContainer:{
    borderColor:'white',
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
      justifyContent:'center',
      alignItems:'center',
      margin:5,
    },
    addButton : {
      fontSize: 20,
      color: 'white',
      fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
    result:{
      fontSize:30,
      fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
      padding:10,
      fontWeight:'bold',
      textAlign:'center',
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
    secondaryButton: {
      padding:10,
      flex:1,
      height:45,
      overflow:'hidden',
      borderRadius:10,
    },
}
