/*
*@author Richard Igbiriki October 2017
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
  TouchableHighlight,
  RefreshControl,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import AutoExpandingTextInput from 'react-native-auto-expanding-textinput'
import {
  AdMobBanner,
 } from 'react-native-admob'
import Firebase from '../auth/firebase'
import * as Notifications from '../auth/notifications'
import * as timestamp from '../auth/timestamp'
import NavBar from './navBar'
const firebase = require('firebase')
export default class Theory extends Component {
  constructor (props) {
    super (props)
    this.state = {
      comments:[],
      index:0,
      isLoading:false,
      noQuestions:false,
      refreshing:true,
      userId:'',
      profilePicture:'none',
      username:'',
      user:'',
      bookmark:false,
    }
    this.renderItem = this.renderItem.bind(this)
    this.commentsRef = firebase.database().ref().child('answers').child(this.props.questionId)
    this.upvoteRef = firebase.database().ref().child('upvotes')
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Retrieve user info
    var userId = await AsyncStorage.getItem('myKey')
    var profilePicture = await AsyncStorage.getItem('pPicture')
    var user = await AsyncStorage.getItem('name')
    var username = await AsyncStorage.getItem('username')
    this.setState({userId, profilePicture, username, user})
    //Retrieve comments for the given question
    this.retrieveComments()
  }
  async retrieveComments () {
    this.data = []
    this.setState({refreshing:true,isLoading:true,noQuestions:false})
    //Fetch one result to confirm that comments exists
    this.commentsRef.limitToFirst(1).once('value', (snapshot)=>{
      if (!snapshot.exists()) this.setState({isLoading:false, refreshing:false})
    })
    //Retrieve all comments
     this.commentsRef.on('child_added', (snapshot)=>{
       this.upvoteRef.child(snapshot.key).child(this.state.userId).once('value', (upvoted)=>{
         if (upvoted.exists() && upvoted.val() === true) {
           this.data.push({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:true, downvoted:false})
           this.setState({comments:this.data, refreshing:false, noComments:false, isLoading:false})
         }else if(upvoted.exists() && upvoted.val() === false) {
           this.data.push({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:true})
           this.setState({comments:this.data, refreshing:false, noComments:false, isLoading:false})
         }else{
           this.data.push({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:false})
           this.setState({comments:this.data, refreshing:false, noComments:false, isLoading:false})
         }
       })
    })
  }
  upvote (item, index) {
    //If the user has not previously upvoted the answer
    if (!item.upvoted) {
      //Set value for upvote to true for user
     this.upvoteRef.child(item.key).child(this.state.userId).set(true)
     //If the user had previously downvoted the answer, increase number of votes by 2
     if (item.downvoted) {
       item.votes = item.votes + 2
       //Update number of votes by 2
       var ref = this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 2)
       })
     }
     else {
       //If the user is just upvoting without previously downvoting
       //Update records by 1
       item.votes = item.votes + 1
       var ref = this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 1)
       })
     }
     //Update the UI to reflect changes in data
     item.upvoted = !item.upvoted
     item.downvoted = false
     var clone = this.state.comments
     clone[index] = item
     this.setState({comments:clone})
     //Send notification to user
     Notifications.sendNotification(item.userId, 'upvote', this.props.questionId, this.props.question, this.props.courseCode)
    }
  }
  downvote (item, index) {
    //See upvote for comments
    if (!item.downvoted) {
      this.upvoteRef.child(item.key).child(this.state.userId).set(false)
      if (item.upvoted) {
        item.votes = item.votes - 2
        var ref = this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 2)
        })}
      else {
        item.votes = item.votes - 1
        var ref = this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 1)
        })
      }
      item.downvoted = !item.downvoted
      item.upvoted = false
      var clone = this.state.comments
      clone[index] = item
      this.setState({comments:clone})
      //Send notification to user
      Notifications.sendNotification(item.userId, 'downvote', this.props.questionId, this.props.question,  this.props.courseCode)
    }
  }
  deleteComment (key) {
    this.upvoteRef.child(key).remove()
    this.commentsRef.child(key).remove()
    this.data = this.state.comments.filter((comment)=> { return comment.key !== key})
    this.setState({comments:this.data})
  }
  bookmarkQuestion () {
    //Check if question has been previously bookmarked, if so remove it
    //Bookmark new questions
    if (this.state.bookmark) {
      this.bookmarksRef.child(this.state.userId).child(this.props.questionId).remove()
    }else {
      //Set data structure for bookmarked question
      var data = {
        courseCode:this.props.courseCode,
        answer:this.props.answer !== '' ? this.props.answer : '',
        question:this.props.question
      }
      this.bookmarksRef.child(this.state.userId).child(this.props.questionId).update(data)
    }
    this.setState(prevState =>({bookmark:!prevState.bookmark}))
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={{flex:1}}>
        <View style={customStyles.secondaryContainer}>
          <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
          <View style={customStyles.usernameContainer}>
            <Text style={[styles.textColor, customStyles.username]}>{item.user}</Text>
            <Text style={[styles.textColor, customStyles.handle]}>@{item.username}</Text>
          </View>
          <View>
            <Text style={[styles.textColor, customStyles.timestamp]}>{timestamp.timeSince(item.createdAt)}</Text>
          </View>
        </View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{alignItems:'center', justifyContent:'center'}}>
              <TouchableHighlight onPress={()=>this.upvote(item, index)} underlayColor={'transparent'}>
                <Image source={require('../assets/images/upvote.png')} resizeMode={'cover'} style={[customStyles.icons, styles.iconColor]} />
              </TouchableHighlight>
                <Text style={[customStyles.actions, styles.textColor]}>{item.votes}</Text>
                <TouchableHighlight onPress={()=>this.downvote(item, index)} underlayColor={'transparent'}>
                  <Image source={require('../assets/images/downvote.png')} resizeMode={'cover'} style={[customStyles.icons, styles.iconColor]} />
                </TouchableHighlight>

          </View>

          <View style={{flex:1}}>
              <Text style={[customStyles.actions, styles.textColor]}>{item.comment}</Text>
          </View>
        </View>
          <View style={{justifyContent:'flex-end', alignItems:'flex-end'}}>
            {this.state.userId === item.userId && <Text style={[styles.textColor, customStyles.timestamp]} onPress={()=>this.deleteComment(item.key)}>Delete</Text>}
          </View>
      </View>
    </View>
      )
   }
  renderFlatList () {
     return (
       <View style={{flex:1, flexDirection:'row'}}>
         <FlatList
           data={this.state.comments}
           ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
           renderItem={this.renderItem}
           refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
               onRefresh={this.retrieveComments.bind(this)}
           />
          }
      />
       </View>
     )
   }
  shareComment () {
     var data = {
       userKey: this.state.userId,
       comment: this.state.text,
       username:this.state.username,
       user:this.state.user,
       profilePicture: this.state.profilePicture,
       votes: 0,
       createdAt: firebase.database.ServerValue.TIMESTAMP
     }
     this.commentsRef.push(data)
     this.setState({text: ''})
     if (this.props.userId) {
        Notifications.sendNotification(this.props.userId, 'comment', this.props.questionId, this.props.question, this.props.courseCode)
     }
   }
   _onChangeHeight = (before, after) => {
  }
  bannerError = (e) => {
    //Failed to load banner
  }
  render () {
    return (
      <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={styles.container}>
        <NavBar title={this.props.courseCode} backButton={true}/>
        <View style={styles.secondaryContainer} >
          <Text style={[customStyles.listText, styles.textColor]}>{this.props.question}</Text>
          {!this.props.comments && <View style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
             <Button onPress={()=>this.bookmarkQuestion()}>
              {this.state.bookmark ? <Image source={require('../assets/images/bookmark.png')} style={[{width:25, height:25, margin:10, tintColor:'red', padding:10}]} resizeMode={'contain'}/>:
            <Image source={require('../assets/images/bookmark.png')} style={[styles.iconColor, {width:25, height:25, margin:10, padding:10}]} resizeMode={'contain'}/>}
            </Button>
          </View>}
            {this.props.answer !== ''&& !this.props.comments && <Text style={[customStyles.answer, styles.textColor]}>Suggested Answer: {this.props.answer}</Text>}
            <AdMobBanner
              adSize="smartBannerPortrait"
              adUnitID="ca-app-pub-1090704049569053/1792603919"
              testDeviceID="EMULATOR"
              didFailToReceiveAdWithError={this.bannerError} />
          <View style={{flex:6,flexDirection:'row' }}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else {
                if (this.state.comments.length === 0) return (<ScrollView contentContainerStyle={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>{this.props.comments ? 'No Comments' : 'No Answers Yet'}</Text></ScrollView>)
                else return this.renderFlatList()
              }
            })()
          }
          </View>
          <View style={{flex: 0, flexDirection: 'row', height: 60, backgroundColor: '#EEEEEE', justifyContent: 'space-around', padding: 5}}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20
              }}
              resizeMode={'cover'}
              source={{uri: this.state.profilePicture}}
                 />
            <AutoExpandingTextInput
              minHeight={50}
              maxHeight={55}
              enablesReturnKeyAutomatically={true}
              onChangeHeight={this._onChangeHeight}
              returnKeyType="done"
              style={customStyles.postInput}
              placeholder={'Write Something...'}
              placeholderTextColor={'rgba(198,198,204,1)'}
              onChangeText={(text) => { this.setState({text: text}) }}
              value={(this.state && this.state.text) || ''}
            />
            <View style={{flex: 0, justifyContent: 'flex-end', alignItems: 'center', marginRight: 5, flexDirection: 'row'}} >
              <Text style={{padding: 2, color: '#283593'}} >{this.state.chars}</Text>
              <Text onPress={() => { this.shareComment() }} style={{ padding: 5, color: '#283593', fontSize: 14}} >Share</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  answer:{
    fontSize:15,
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
    marginLeft:5,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    padding:5
    },
  icons:{
    resizeMode: 'cover',
    width: 30,
    height: 30,
    alignItems:'flex-end',
  },
  postInput: {
    flex: 4,
    height: 50,
    padding: 5,
    fontSize: 14,
    color: 'black',
    fontFamily: 'Verdana',
    borderColor: 'rgba(0,0,0,0.5)'
  },
  timestamp:{
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  handle:{
    marginLeft:10,
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  usernameContainer:{
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center',
  },
  profilePicture:{
    width:40,
    height:40,
    borderRadius:20,
    borderColor:'white',
    borderWidth:1,
  },
  username:{
    marginLeft:10,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  secondaryContainer:{
    flex:1,
    flexDirection:'row',
     padding:3
   },
})
