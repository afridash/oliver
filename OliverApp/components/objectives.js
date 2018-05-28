import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Swipeable from 'react-native-swipeable'
import NavBar from './navBar'

export default class Objectives extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data: [],
      refreshing: false,
      swipingStarted:false,
      isLoading:true,
      noBookmarks:false,
      status:'',
      verified:false,
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('questions').child(this.props.courseId)
    this.rightButtons = [<Text onPress={()=>this.handleSwipeClick()} style={customStyles.swipeButton}>Delete</Text>,]
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Retrieve user key
    var key = await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    var verified = await AsyncStorage.getItem('verified')
    var status = await AsyncStorage.getItem('status') //Check the internet status
    if (verified !== null && verified !=='1') this.setState({verified:true})
    this.setState({userId:key, status})
    //Start component lifecycle with call to loading questions stored offline
    if (currentUser === key)
    this.retrieveQuestionsOffline()
    else this.retrieveQuestionsOnline()
  }
  async retrieveQuestionsOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read questions from firebase, then store them locally
    var questions = []
    var stored = await AsyncStorage.getItem(this.props.courseId+'study')
    if (stored !== null) questions = JSON.parse(stored)
    if (questions.length === 0 || questions === null) {
      this.retrieveQuestionsOnline ()
    }else{
      this.data = questions
      this.setState({data:questions, noQuestions:false,isLoading:false, total:questions.length})
      this.checkInternetStatus()
    }
  }
  async checkInternetStatus () {
    //Reload notifictions if there is internet status
    if (this.state.status === 'true') {
      this.retrieveQuestionsOnline ()
    }
  }
  retrieveQuestionsOnline () {
    AsyncStorage.setItem('currentUser', this.state.userId)
    this.data = []
    this.setState({refreshing:true, noQuestions:false, total:0})
    this.ref.orderByChild('type').equalTo('objective').once('value', (snapshot)=>{
      if (!snapshot.exists()) {
          AsyncStorage.setItem(this.props.courseId+'study', JSON.stringify([]))
        this.setState({refreshing:false, noQuestions:true,isLoading:false})
      }
      else this.setState({refreshing:false, noQuestions:false,isLoading:true})
      var answer
      snapshot.forEach((snap)=>{
          if (snap.val().answer.toUpperCase() === 'A') answer = snap.val().optionA
          else if (snap.val().answer.toUpperCase() === 'B') answer = snap.val().optionB
          else if (snap.val().answer.toUpperCase() === 'C') answer = snap.val().optionC
          else if (snap.val().answer.toUpperCase() === 'D') answer = snap.val().optionD
          else answer = ''
          this.data.push({key:snap.key, question:snap.val().question, show:false, textAnswer:answer})
          this.setState({data:this.data, noQuestions:false,isLoading:false, refreshing:false})
          AsyncStorage.setItem(this.props.courseId+'study', JSON.stringify(this.data))
      })
    })
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
        <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}>{index+1} {item.question}</Text>
        {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
      {item.show && <View style={{flex:1}}>
        <View style={[customStyles.actionsContainer, styles.actionsContainer]}>
        <Text style={[customStyles.actions, styles.textColor]}>{item.textAnswer}</Text>
      </View>
      </View>
    }
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
             onRefresh={this.retrieveQuestionsOnline.bind(this)}
         />
        }
    />
     )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} title={this.props.courseCode} />
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noQuestions) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}>:( No Objectives...Check Back Later</Text></View>)
              else return this.renderFlatList()
            })()
          }
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
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    },
  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
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
})
