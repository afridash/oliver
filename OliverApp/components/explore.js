/*
*@author Richard Igbiriki October 6, 2017
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
  TextInput,
  RefreshControl,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
 import * as Notifications from '../auth/notifications'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import * as timestamp from '../auth/timestamp'

import NavBar from './navBar'
export default class Explore extends Component {
  constructor (props) {
    super (props)
    this.user = firebase.auth().currentUser
    this.state = {
      activities:[],
      index:0,
      post:"",
      likes:0,
      isLoading:true,
      noActivity:false,
      refreshing:false,
      status:'',
      verified:false,

    }
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('explore')
    this.likesRef = firebase.database().ref('explore_likes')
    this.postsRef = firebase.database().ref().child('posts')
    this.statsRef = firebase.database().ref().child('student_stats')
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Retrieve user key
    var key = await AsyncStorage.getItem('collegeId')
    var userId= await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    var status = await AsyncStorage.getItem('status') //Check the internet status
    var verified = await AsyncStorage.getItem('verified')
    if (verified !== null && verified !== '1') this.setState({verified:true})
    this.setState({collegeId:key, userId, status})

    //Start component lifecycle with call to loading questions stored offline
    if (currentUser === userId) {
      this.retrieveActivitiesOffline ()
    }
    else{
      this.retrieveActivitiesOnline ()
    }
  }
  async retrieveActivitiesOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read courses from firebase, then store them locally
    var explores = []
    var stored = await AsyncStorage.getItem("explores")
    if (stored !== null) explores = JSON.parse(stored)
    if (explores.length === 0 || explores === null) {
      this.retrieveActivitiesOnline()
    }else{
      this.data = explores
      this.setState({activities:this.data, refreshing:false, isLoading:false})
      this.checkInternetStatus()
    }
  }
  async checkInternetStatus () {
    if (this.state.status === 'true') {
      this.retrieveActivitiesOnline()
    }
  }
  retrieveActivitiesOnline () {
    this.data = []
    AsyncStorage.setItem('currentUser', this.state.userId)
    this.setState({refreshing:true,isLoading:false,noActivity:false})
    this.ref.child(this.state.collegeId).limitToFirst(100).once('value',(snapshot)=>{
      if (!snapshot.exists()) {
        this.setState({refreshing:false, noActivity:true,isLoading:false})
        AsyncStorage.setItem('explores', JSON.stringify([]))
      }
      else this.setState({refreshing:true, noActivity:false})
      snapshot.forEach((snap)=>{
        this.likesRef.child(snap.key).child(this.state.userId).once('value', (likeVal)=>{
          if (likeVal.exists()){
            this.data.push({
                            key:snap.key,courseId:snap.val().courseId, likes:snap.val().starCount,
                            code:snap.val().courseCode, title:snap.val().course,percentage:snap.val().percentage,
                            createdAt:snap.val().createdAt, message:snap.val().message, username:snap.val().username,
                             postLike:true, profilePicture:snap.val().profilePicture, comments:snap.hasChild('comments') ? snap.val().comments : 0,
                             userId:snap.val().userId})
            this.setState({activities:this.data, refreshing:false, isLoading:false})
            AsyncStorage.setItem('explores', JSON.stringify(this.data))
          }else{
            this.data.push({key:snap.key,courseId:snap.val().courseId, likes:snap.val().starCount,postLike:false, code:snap.val().courseCode, title:snap.val().course,percentage:snap.val().percentage,
                            createdAt:snap.val().createdAt, message:snap.val().message,userId:snap.val().userId, username:snap.val().username, profilePicture:snap.val().profilePicture, comments:snap.hasChild('comments') ? snap.val().comments : 0,})
            this.setState({activities:this.data, refreshing:false, isLoading:false})
            AsyncStorage.setItem('explores', JSON.stringify(this.data))
          }
        })

      })
    })
  }
  onRowPress(key, post){
    if (post.postLike) {
      this.unlikePost(post.key)
      post.likes = post.likes - 1
    } else {
      this.likePost(post.key, post)
      post.likes = post.likes + 1
    }
    post.postLike =!post.postLike
    var clone = this.state.activities
    clone[key] = post
    this.setState({posts:clone})
  }
  likePost (postId, post) {
   this.likesRef.child(postId).child(this.state.userId).set(true)
   var ref = this.ref.child(this.state.collegeId).child(postId).child('starCount').once('value', (likesCount)=>{
      likesCount.ref.set(likesCount.val() + 1)
    })
    Notifications.sendNotification(post.userId, 'explore_like', postId, post.message + " " + post.percentage + "% in "+ post.title + "("+post.code+")", post.username)
  }
  unlikePost (postId) {
    this.likesRef.child(postId).child(this.state.userId).remove()
    var ref = this.ref.child(this.state.collegeId).child(postId).child('starCount').once('value', (likesCount)=>{
       likesCount.ref.set(likesCount.val() - 1)
    })
  }
  handleGo (item) {
    var ref = this.statsRef.child(item.courseId).child(this.state.userId).child('explore_origin').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
    return Actions.start_exam({courseId:item.courseId, courseCode:item.code, course:item.title})
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={customStyles.secondaryContainer}>
        <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
        <View style={customStyles.usernameContainer}>
          <Text style={[styles.textColor, customStyles.username]}>{item.username}</Text>
        </View>
        <View>
          <Text style={[styles.textColor, customStyles.timestamp]}>{timestamp.timeSince(item.createdAt)}</Text>
        </View>
      </View>
       <View style={{flex:1, margin:5, padding:10}}>
        <Text style={[styles.textColor, customStyles.message]}>{item.message}</Text>
        <Text style={[styles.textColor, customStyles.message]}>{item.percentage}% in {item.title} ({item.code})</Text>
      </View>
      <View style={customStyles.interactions}>
        <View style={{flex:1, alignItems:'flex-start',justifyContent:'flex-start'}}>
          <Button style={[styles.textColor]} onPress={()=>this.onRowPress(index, item)}>
            {!item.postLike ? <Image source={require('../assets/images/heart2.png')} style={[customStyles.home, styles.iconColor]} /> :
          <Image source={require('../assets/images/heart2.png')} style={[customStyles.home,{tintColor: 'red' }]} />
        }
          <Text style={styles.textColor}>{item.likes !== 0 && item.likes }</Text>
        </Button>
        </View>
        <View style={{flex:1, alignItems:'flex-end', justifyContent:'center',  marginRight:15}}>
          <Button
            style={[styles.textColor]} onPress={()=>Actions.viewTheory({question:item.message + " " + item.percentage + "% in "+ item.title + "("+item.code+")", questionId:item.key, courseCode:item.username, comments:true, userId:item.userId})}>
            <Image source={require('../assets/images/comments.png')} style={[customStyles.comment, styles.iconColor]} />
            <Text style={[{marginLeft:3}, styles.textColor]}>{item.comments !== 0 && item.comments}</Text>
        </Button>
        </View>
      </View>
      <View>
        <Button
          containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
          style={customStyles.addButton}
          styleDisabled={{color: 'red'}}
          onPress={()=>this.handleGo(item)}>
          Start
        </Button>
      </View>
    </View>
      )
   }
  renderFlatList () {
     return (
       <FlatList
         data={this.state.activities}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.retrieveActivitiesOnline.bind(this)}
         />
        }
    />
     )
   }
   renderHeader () {
     return  (
       <View style={customStyles.inputContainer} >
         <TextInput
           style={customStyles.input}
           placeholder='Search'
           onChangeText={(text) => { this.searchcourses(text) }}
         />
       </View>
     )
   }
   searchcourses (text) {
     /*
     * Filter user explore posts by username or course title
     * If no result, update the view
     */
     var clone = this.data
     this.result = clone.filter ((activity) => { return activity.username.toLowerCase().includes(text.toLowerCase()) === true || activity.title.toLowerCase().includes(text.toLowerCase()) === true })
     if (this.result.length > 0)
     this.setState({activities:this.result, noSearchResult:false})
     else this.setState({noSearchResult:true})
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Explore'/>
        <View style={styles.secondaryContainer} >
          <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noActivity) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}> No Explorers</Text></View>)
                else if (this.state.noSearchResult) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}> :( Nothing Found</Text></View>)
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
  secondaryContainer:{
    flex:1,
    flexDirection:'row',
     padding:3
   },
   home:{
     margin: 15,
     marginRight:5,
     resizeMode: 'contain',
     width: 25,
     height: 25,
     alignItems:'flex-end',

   },
   comment:{
     resizeMode: 'contain',
     width: 25,
     height: 25,
   },
   menu:{
     flex:4,
     justifyContent:'flex-start',
     alignItems:'flex-start',
     marginTop:10,
    flexDirection:'row',
   },
   interactions:{
     flex:4,
     justifyContent:'space-between',
     marginTop:10,
    flexDirection:'row',
   },
  listItem:{
    padding:10,
  },
  timestamp:{
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  usernameContainer:{
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center',
  },
  profilePicture:{
    width:50,
    height:50,
    borderRadius:25,
    borderColor:'white',
    borderWidth:1,
  },
  username:{
    marginLeft:10,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  message:{
    marginLeft:5,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    padding:5
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
  inputContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  addButton : {
    fontSize: 18,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  secondaryButton: {
    padding:10,
    flex:1,
    height:45,
    margin:1,
    overflow:'hidden',
    borderRadius:10,
  },
})
