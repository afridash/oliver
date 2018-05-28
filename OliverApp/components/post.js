import React, {Component} from 'react'
import {
  View,
  AsyncStorage,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableHighlight,
  KeyboardAvoidingView,
  TextInput
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import {Text, Icon, Button, ActionSheet, StyleProvider} from 'native-base'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TButton from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import * as timestamp from '../auth/timestamp'
import NavBar from './navBar'
import * as Notifications from '../auth/notifications'

var BUTTONS = [
  { text: "Delete", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

export default class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      tagged: [],
      index: 0,
      userId:'',
      username:'',
      user:'',
      name:'Richard Igbiriki',
      comment:'',
      refreshing:true,
      following:false,
      maxHeight:50,
      minHeight:100,
      text:'',
    }
    this.postId = this.props.postId
    this.commentsRef = firebase.database().ref().child('post_comments')
    this.postsRef = firebase.database().ref().child('posts')
    this.likesRef = firebase.database().ref().child('comment_likes')
    this.usersRef = firebase.database().ref().child('users')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.data = []
    this.tagged = []
    this.textInput = ''
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentWillMount () {
    this.postsRef.child(this.postId).once('value', (post)=> {
      this.setState({
        post:post.val().post,
        postPicture:post.val().profilePicture,
        postUserId:post.val().userId,
        postDisplayName:post.val().displayName,
        postCreatedAt:post.val().createdAt,
      })
    })
  }
  handleUser = async (user) => {
    if (user) {
      this.usersRef.child(user.uid).child('username').once('value', async (username)=> {
        await this.setState({userId:user.uid, user:user.displayName, username:username.val(), profilePicture:user.photoURL})
        this.retrieveComments()
      })
    }
  }
  async retrieveComments () {
    this.setState({refreshing:true, noComments:false})
    //Fetch one result to confirm that comments exists
    this.commentsRef.limitToFirst(1).once('value', (snapshot)=>{
      if (!snapshot.exists()) this.setState({noComments:true, refreshing:false})
    })
    //Retrieve all comments
     this.commentsRef.child(this.postId).on('child_added', (snapshot)=>{
       this.likesRef.child(snapshot.key).child(this.state.userId).once('value', (upvoted)=>{
         if (upvoted.exists() && upvoted.val() === true) {
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:true, downvoted:false})
         }else if(upvoted.exists() && upvoted.val() === false) {
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:true})
         }else{
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:false})
         }
          this.setState({comments:this.data, refreshing:false, noComments:false, refreshComments: !this.state.refreshComments})
       })
    })
  }
  upvote (item, index) {
    //If the user has not previously upvoted the answer
    if (!item.upvoted) {
      //Set value for upvote to true for user
     this.likesRef.child(item.key).child(this.state.userId).set(true)
     //If the user had previously downvoted the answer, increase number of votes by 2
     if (item.downvoted && item.votes === -1) {
       item.votes = item.votes + 2
       //Update number of votes by 2
       this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 2)
       })
       Notifications.sendUserNotification(item.userId, 'comment_like', this.postId)
     }else {
       //If the user is just upvoting without previously downvoting
       //Update records by 1
       item.votes = item.votes + 1
       this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 1)
       })
       Notifications.sendUserNotification(item.userId, 'comment_like', this.postId)
     }
     //Update the UI to reflect changes in data
     item.upvoted = !item.upvoted
     item.downvoted = false
     var clone = this.state.comments
     clone[index] = item
     this.setState({comments:clone, refreshComments: !this.state.refreshComments})
    }

  }
  downvote (item, index) {
    //See upvote for comments
    if (!item.downvoted) {
      this.likesRef.child(item.key).child(this.state.userId).set(false)
      if (item.upvoted && item.votes === 1) {
        item.votes = item.votes - 2
        this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 2)
        })}
      else {
        item.votes = item.votes - 1
        this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 1)
        })
      }
      item.downvoted = !item.downvoted
      item.upvoted = false
      var clone = this.state.comments
      clone[index] = item
      this.setState({comments:clone, refreshComments: !this.state.refreshComments})
    }
  }
  deleteComment () {
    var key = this.state.deleteKey
      this.likesRef.child(key).remove()
      this.commentsRef.child(this.postId).child(key).remove()
      this.data = this.state.comments.filter((comment)=> { return comment.key !== key})
      this.setState({comments:this.data})
       this.postsRef.child(this.postId).child('comments').once('value', (comments) => {
         if (comments.exists()) comments.ref.set(comments.val() - 1)
         else comments.ref.set(0)
       })
  }
  shareComment () {
    if (this.state.text !== '') {
      var data = {
        userKey: this.state.userId,
        comment: this.state.text,
        username:this.state.username,
        user:this.state.user,
        profilePicture: this.state.profilePicture,
        votes: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }
      this.commentsRef.child(this.postId).push(data)
      this.setState({text: ''})
      this.handleNotifications()
      //Send notifications to tagged followers
      this.sendTagNotification()
    }
   }
  sendTagNotification () {
     this.tagged = this.state.tagged.filter((user)=> { return this.state.comment.includes(user.username)})
      this.tagged.map((user)=> Notifications.sendUserNotification(user.userId, 'comment_mention', this.postId))
   }
  handleNotifications () {
    Notifications.sendUserNotification(this.state.postUserId, 'comment', this.postId)
    this.postsRef.child(this.postId).child('comments').once('value', (comments) => {
      if (comments.exists()) comments.ref.set(comments.val() + 1)
      else comments.ref.set(1)
    })
   }
  formatTaggedComment (comment) {
    //Break from recursion if there are no more @ symbols in the text
    if (!comment.includes('@')) return (<Text style={[styles.textColor, customStyles.details]}>{comment}</Text>)
    //Split the comment into three halves Before @, @ to space, and After @
      var tempComment = comment
      var position = tempComment.indexOf('@')
      var before = comment.slice(0, position)
      tempComment = tempComment.slice(position)
      var end = tempComment.indexOf(' ')
      var name = tempComment.slice(0, end)
      var after = tempComment.slice(end)
      //Return a recursive call with the After...
     return (<Text style={[styles.textColor, customStyles.details]}>{before} <Text style={{color:'#2980b9'}}>{name}</Text> {this.formatTaggedComment(after)}</Text>)
  }
  replyTo (userId, username) {
    username = username.replace(' ', '_')
    if (userId !== this.state.currentUser){
      this.tagged.push({userId:userId, username:username})
      this.setState({comment:this.state.comment+' @'+username+' ', tagged:this.tagged, currentUser:userId})
    }else if (!this.state.comment.includes('@'+username)) {
        this.setState({comment:this.state.comment+' @'+username+' '})
    }
    this.textInput.focus()
  }
  handleSubmit = (event) => {
    event.preventDefault()
    this.shareComment()
  }
  showOptions (item, index) {
    return (
          ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Delete Post"
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          await this.setState({
            deleteKey: item.key
          })
           this.deleteComment()
        }
      }
    )
   )
  }
  renderItem = ({ item, index }) => {
     return (
      <View style={customStyles.listItem}>
        <View style={{flex:1, padding:10}}>
          <View style={{flexDirection:'row', padding:3, justifyContent:'space-between', flex:1}}>
            <TouchableHighlight style={{flexDirection:'row', flex:1}} onPress={()=>Actions.user({userId:item.userId})}>
              <View style={{flexDirection:'row', flex:1}}>
                <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
                <View>
                  <Text style={[styles.textColor, customStyles.username]}>{item.user}</Text>
                  <View style={{flexDirection:'row'}}>
                    <Icon type='FontAwesome' name='globe' style={[styles.textColor, {fontSize:16, marginLeft:10}]} />
                    <Text style={[styles.textColor, customStyles.timestamp]}> {timestamp.timeSince(item.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            {this.state.userId === item.userId &&
            <Button transparent
              onPress={() => this.showOptions(item, index)}>
              <Icon name='ios-arrow-down' style={[styles.textColor, {fontSize:20}]} />
            </Button>
            }
            </View>
          </View>
          <View style={{marginTop:10, padding:5}}>
            <Text style={[styles.textColor, customStyles.details]}>{this.formatTaggedComment(item.comment)}</Text>
          </View>
          <View style={customStyles.interactions}>
            <View style={{flex:1, alignItems:'flex-start',justifyContent:'flex-start'}}>
              <TButton style={[styles.textColor]} onPress={()=>this.upvote(item, index)}>
                {!item.upvoted ? <Icon type="FontAwesome" name="thumbs-o-up" style={styles.textColor} /> :
                <Icon type="FontAwesome" name="thumbs-o-up" style={{color:'red'}} />
            }
            </TButton>
            </View>
            <View>
              <Text style={styles.textColor}>{item.votes}</Text>
            </View>
            <View style={{flex:1, alignItems:'flex-end', justifyContent:'center',  marginRight:15}}>
              <TButton
                style={[styles.textColor]} onPress={()=>this.downvote(item, index)}>
                {!item.downvoted ? <Icon type="FontAwesome" name="thumbs-o-down" style={styles.textColor} /> :
                <Icon type="FontAwesome" name="thumbs-o-down" style={{color:'red'}} />
                }
            </TButton>
            </View>
          </View>
        </View>
       )
    }
  header () {
      return (
        <View style={customStyles.listItem}>
          <View style={{flex:1, padding:10}}>
            <View style={{flexDirection:'row', padding:3, justifyContent:'space-between', flex:1}}>
              <TouchableHighlight style={{flexDirection:'row', flex:1}} onPress={()=>Actions.user({userId:this.state.postUserId})}>
                <View style={{flexDirection:'row', flex:1}}>
                  <Image source={{uri:this.state.postPicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
                  <View>
                    <Text style={[styles.textColor, customStyles.username]}>{this.state.postDisplayName}</Text>
                    <View style={{flexDirection:'row'}}>
                      <Icon type='FontAwesome' name='globe' style={[styles.textColor, {fontSize:16, marginLeft:10}]} />
                      <Text style={[styles.textColor, customStyles.timestamp]}> {timestamp.timeSince(this.state.postCreatedAt)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
              </View>
            </View>
            <View style={{marginTop:10, padding:5}}>
              <Text style={[styles.textColor, customStyles.details]}>{this.state.post}</Text>
            </View>
          </View>
      )
    }
  renderFlatList () {
    return (
     <View style={{flex:3}}>
       <FlatList
         data={this.state.comments}
         extraData={this.state.refreshComments}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.retrieveComments.bind(this)}
         />
        }
      />
       {(()=>{
         if (this.state.noComments) return (
           <View style={{flex:1, justifyContent:'center'}}>
             <Text style={[customStyles.listText, styles.textColor]}>No Comments</Text></View>
         )
       })()
     }
     </View>
   )
  }
  _onChange = (event) => {
     let curHeight = event.nativeEvent.contentSize.height;
     if (curHeight < this.state.minHeight || curHeight > this.state.maxHeight) return;
     this.setState({
       height: curHeight
     });
   }
  render () {
    let tmpHeight = Math.min(this.state.maxHeight, this.state.height)
    return (
      <StyleProvider style={getTheme(platform)}>
      <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={styles.container}>
        <View style={customStyles.container}>
          <NavBar title="Comments" backButton={true} />
          <ScrollView style={{flex:10}}>
            {this.header()}
            <View style={{flex:3, marginTop:-5}}>
              {this.renderFlatList()}
            </View>
          </ScrollView>
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
          <TextInput
            enablesReturnKeyAutomatically={true}
            onContentSizeChange = {this._onChange}
            returnKeyType="done"
            multiline={true}
            style={[customStyles.postInput, {height:tmpHeight}]}
            placeholder={'Write Something...'}
            placeholderTextColor={'rgba(198,198,204,1)'}
            onChangeText={(text) => { this.setState({text: text}) }}
            value={(this.state && this.state.text) || ''}
            ref = {(input)=> this.textInput = input}
          />
          <View style={{flex: 0, justifyContent: 'flex-end', alignItems: 'center', marginRight: 5, flexDirection: 'row'}} >
            <Text onPress={() => { this.shareComment() }} style={{ padding: 5, color: '#283593', fontSize: 14}} >Share</Text>
          </View>
        </View>
       </KeyboardAvoidingView>
     </StyleProvider>
    )
  }
}
const customStyles = StyleSheet.create({
  container:{
    flex:10,
  },
  secondaryContainer: {
    flex:1,
    flexDirection:'row',
    padding:15,
    alignItems:'center'
  },
  inputContainer: {
    flex: 1,
    padding:8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth:20
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
  listItem:{
    padding:5,
  },
  usernameContainer:{
    flex:1,
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  profilePicture:{
    width:60,
    height:60,
    borderRadius:30,
    borderColor:'white',
    borderWidth:1,
  },
  username:{
    marginLeft:10,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  timestamp:{
    fontSize:14,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  details:{
    marginLeft:10,
    fontSize:14,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
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
  interactions:{
    flex:4,
    justifyContent:'space-between',
    marginTop:10,
   flexDirection:'row',
  },
  postInput: {
    flex: 4,
    padding: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    color: 'black',
    fontFamily: 'Verdana',
    borderColor: 'rgba(0,0,0,0.5)'
  },
});
