/*
*@author Richard Igbiriki October 5, 2017
*/
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
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import HTMLView from 'react-native-htmlview'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
var color = theme.name
import NavBar from './navBar'
export default class Theories extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:[],
      index:0,
      isLoading:true,
      noQuestions:false,
      refreshing:false,
      total:0,
      verified:false,
    }
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('questions').child(this.props.courseId)
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    color = theme.name
    //Retrieve user key
    var key = await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    var status = await AsyncStorage.getItem('status') //Check the internet status
    var verified = await AsyncStorage.getItem('verified')
    if (verified !== null && verified !== '1') this.setState({verified:true})
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
    var stored = await AsyncStorage.getItem(this.props.courseId)
    if (stored !== null) questions = JSON.parse(stored)
    if (questions.length === 0 || questions === null) {
      this.retrieveQuestionsOnline ()
    }else{
      this.data = questions
      this.setState({questions:questions, noQuestions:false,isLoading:false, total:questions.length})
      this.checkInternetStatus()
    }
  }
  async checkInternetStatus () {
    //Reload theories if there is internet status
    if (this.state.status === 'true') {
      this.retrieveQuestionsOnline ()
    }
  }
  retrieveQuestionsOnline () {
    AsyncStorage.setItem('currentUser', this.state.userId)
    this.data = []
    this.setState({refreshing:true,isLoading:false,noQuestions:false, total:0})
    this.ref.orderByChild('type').equalTo('theory').once('value',(snapshot)=>{
      if (snapshot.exists()) this.setState({refreshing:false, noQuestions:false,isLoading:false})
      else {
        AsyncStorage.setItem(this.props.courseId, JSON.stringify([]))
        this.setState({refreshing:false, noQuestions:true,isLoading:false})
      }
      snapshot.forEach((snap)=>{
          this.data.push({key:snap.key, question:snap.val().question, answered:snap.val().answered,
            answer:snap.val().answered ? snap.val().answer : '',
            comments:snap.hasChild('comments') ? snap.val().comments : 0 })
          this.setState({questions:this.data, total:this.state.total+1})
          AsyncStorage.setItem(this.props.courseId, JSON.stringify(this.data))
      })
    })
  }
  renderItem({ item, index }) {
    const htmlStyles = {
      p: {
        fontSize:16,
        padding:-10,
        color: (color === 'default' ) ? 'white' : '#ed9b9b',
        fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
      }
    }
   return (
     <View
      style={customStyles.listItem}>
      <TouchableWithoutFeedback
        onPress={()=>Actions.viewTheory({courseCode:this.props.courseCode, question:item.question, questionId:item.key, answer:item.answered ? item.answer : "", courseId:this.props.courseId})}
        style={{flex:1}}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View>
            <HTMLView
            value={"<p>"+item.question+"</p>"}
            stylesheet={htmlStyles}
            />
          </View>
          <View>
             <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Text style={[styles.textColor, customStyles.responses]}>{item.comments !== 0 && "Responses: "+item.comments}</Text>
    </View>
      )
   }
  renderFlatList () {
     return (
       <FlatList
         data={this.state.questions}
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
        <NavBar progress={''+this.state.total} title={this.props.courseCode} backButton={true}/>
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noQuestions) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}>:( No Theories...Check Back Later</Text></View>)
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
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
  responses:{
    fontSize:12,
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
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    },

  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
})
