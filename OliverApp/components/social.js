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
  Modal
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import {Text, Icon, Card, CardItem, Body, Tab, Tabs, Button, ActionSheet, StyleProvider, Spinner, Textarea, Form} from 'native-base'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
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
export default class Social extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noActivity:false,
      user:{followers:0, followings:0},
      posts:[],
      following:[],
      followers:[],
      totalFollowers:20,
      current:0,
      counter:0,
      refreshing:true,
      post:'',
      modalVisible:false,
      post:'',
    }
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.followersRef = firebase.database().ref().child('followers')
    this.followingRef = firebase.database().ref().child('following')
    this.postsRef = firebase.database().ref().child('posts')
    this.userPostsRef = firebase.database().ref().child('user_posts')
    this.likesRef = firebase.database().ref().child('post_likes')
    this.notificationsRef = firebase.database().ref('notifications')
    this.badgesRef = firebase.database().ref().child('badges')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.increment = 20
    this.data = []
    this.posts = []
    this.followers = []
    this.following = []
  }
  handleUser = (user) => {
    if (user) {
      if (this.props.userId !== undefined) {
        this.getUser(this.props.userId)
        this.retrievePosts(this.props.userId)
        this.retrieveFollowers(this.props.userId)
        this.retrieveFollowing(this.props.userId)
        this.setState({postAvailable:false, currentUser:this.props.userId})
      }else{
        this.getUser(user.uid)
        this.retrievePosts(user.uid)
        this.retrieveFollowers(user.uid)
        this.retrieveFollowing(user.uid)
        this.setState({postAvailable:true, currentUser:user.uid})
      }
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
      }
  }
  async getUser (userId) {
    this.usersRef.child(userId).once('value', (user)=> {
      this.listUser(user, 'users')
    })
  }
  async listUser (user, type) {
    var temp = {}
    var stars = 0
    var completed = 0
    var points = 0
    await this.statsRef.child(user.key).once('value', (stats)=> {
      if (stats.exists()) {
        if (stats.val().points > 2000) {
          stars = 5
        }else if (stats.val().points > 1500) {
          stars = 4
        }else if (stats.val().points > 500) {
          stars = 3
        }else if (stats.val().points > 100) {
          stars = 2
        }else if (stats.val().points <= 100) {
          stars = 1
        }
        completed = stats.val().completed
        points = stats.val().points
      }
    })
    this.followersRef.child(user.key).child(this.state.userId).once('value', (following)=> {
      if (following.exists()) {
        temp = {
          userId:user.key,
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          followers:user.val().followers ? user.val().followers : 0, //People that follow me
          followings:user.val().following ? user.val().following : 0,//People I follow
          stars:stars,
          following:true,
          key:user.key
        }
      }else{
        temp = {
          userId:user.key,
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          followers:user.val().followers ? user.val().followers : 0,
          followings:user.val().following ? user.val().following : 0,
          stars:stars,
          following:false,
          key:user.key
        }
      }
      if (type === 'users') this.setState({user:temp, loading:false})
      else if (type === 'followers') {
        this.followers.push(temp)
        this.setState({followers:this.followers, loading:false})
      }else if (type === 'following') {
        this.following.push(temp)
        this.setState({following:this.following, loading:false})
      }
    })
  }
  retrievePosts (userId) {
    this.posts = []
    this.setState({refreshing:true, current:0,counter:0,})
    this.userPostsRef.child(userId).limitToFirst(200).once('value', (posts)=> {
      var count = 0
      if (!posts.exists()) this.setState({refreshing:false, noActivity:true})
      else {
        count = Object.keys(posts.val()).length
      }
      var index = 0
      posts.forEach((post)=> {
        this.postsRef.child(post.val()).once('value', (p)=> {
          if (p.exists()){
            this.likesRef.child(post.val()).child(this.state.userId).once('value', (likeVal)=> {
              if (likeVal.exists()) {
                this.posts.push({
                  postKey:post.val(),
                  key:post.key,
                  userId:p.val().userId,
                  displayName:p.val().displayName,
                  profilePicture:p.val().profilePicture,
                  post:p.val().post,
                  createdAt:p.val().createdAt,
                  comments:p.val().comments,
                  starCount:p.val().starCount,
                  postLike:true,
                })
              }else{
                this.posts.push({
                  postKey:post.val(),
                  key:post.key,
                  userId:p.val().userId,
                  displayName:p.val().displayName,
                  profilePicture:p.val().profilePicture,
                  post:p.val().post,
                  createdAt:p.val().createdAt,
                  comments:p.val().comments,
                  starCount:p.val().starCount,
                  postLike:false
                })
              }
              index++
              if (index === count) {
                this.showNextSet()
              }
            })
          }else{
            count--
          }
        })
      })
    })
  }
  retrieveFollowers (userId) {
    this.followersRef.child(userId).once('value', (followers)=> {
      if (!followers.exists()) this.setState({noFollowers:true})
      followers.forEach((follower)=> {
        this.usersRef.child(follower.key).once('value', (user)=>{
          this.listUser(user, 'followers')
        })
      })
    })
   }
  retrieveFollowing (userId) {
     this.followingRef.child(userId).once('value', (followers)=> {
       if (!followers.exists()) this.setState({noFollowings:true})
       followers.forEach((follower)=> {
         this.usersRef.child(follower.key).once('value', (user)=>{
           this.listUser(user, 'following')
         })
       })
     })
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.posts[i])
       this.setState({posts:this.data, refreshing:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
    if (this.state.counter + this.increment > this.posts.length-1){
      await this.setState({current:this.state.counter, counter:this.posts.length-1, next:false,})
    }else {
        await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
    }
    await this.getNextSet()
  }
  loadMore () {
    if (this.state.isListScrolled) {
      this.showNextSet()
    }
  }
  printStars (user) {
    var items = []
    for (var i=0; i<user.stars; i++) {
       items.push(<Icon key={i} name='ios-star' style={[styles.textColor, {fontSize:18}]} />)
    }
    return items
  }
  onRowPress(key, post){
    if (post.postLike) {
        this.unlikePost(post.postKey)
        post.starCount = post.starCount - 1
      } else {
        this.likePost(post.postKey, post)
        post.starCount = post.starCount + 1
      }
      post.postLike = !post.postLike
      var clone = this.state.posts
      clone[key] = post
      this.setState({posts:clone})
  }
  likePost (postId, post) {
     this.likesRef.child(postId).child(this.state.userId).set(true)
       this.postsRef.child(postId).child('starCount').once('value', (likesCount)=>{
        likesCount.ref.set(likesCount.val() + 1)
      })
    Notifications.sendUserNotification(post.userId, 'like', postId)
  }
  unlikePost (postId) {
    this.likesRef.child(postId).child(this.state.userId).remove()
    this.postsRef.child(postId).child('starCount').once('value', (likesCount)=>{
        likesCount.ref.set(likesCount.val() - 1)
    })
  }
  deletePost () {
    this.data = []
    if (this.state.userId === this.state.postUserId) {
      this.userPostsRef.child(this.state.userId).child(this.state.deleteKey).remove()
      this.postsRef.child(this.state.postId).remove()
      this.filterPosts()
    }else{
      this.userPostsRef.child(this.state.userId).child(this.state.deleteKey).remove()
      this.filterPosts()
    }
  }
  async filterPosts () {
    this.posts = this.posts.filter((post)=> post.key !== this.state.deleteKey)
    await this.setState({counter:0,current:0})
    this.showNextSet()
  }
  followUser (user) {
    if (user.following) {
      this.followersRef.child(user.userId).child(this.state.userId).remove()
      this.followingRef.child(this.state.userId).child(user.userId).remove()
      this.usersRef.child(user.userId).child('followers').once('value', (followers)=> {
        if (followers.exists()) followers.ref.set(followers.val() - 1)
      })
      this.usersRef.child(this.state.userId).child('following').once('value', (following)=> {
        if (following.exists()) following.ref.set(following.val() - 1)
      })
      user.followers = user.followers - 1
    }else {
        this.followersRef.child(user.userId).child(this.state.userId).set(true)
        this.followingRef.child(this.state.userId).child(user.userId).set(true)
        this.usersRef.child(user.userId).child('followers').once('value', (followers)=> {
          if (followers.exists()) followers.ref.set(followers.val() + 1)
          else followers.ref.set(1)
        })
        this.usersRef.child(this.state.userId).child('following').once('value', (following)=> {
          if (following.exists()) following.ref.set(following.val() + 1)
          else following.ref.set(1)
        })
        user.followers = user.followers + 1
        //Send notification for new follower
        var postData = {
          userId: this.state.userId,
          profilePicture: this.state.profilePicture,
          displayName: this.state.displayName,
          type: 'follow',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }
        var item = this.notificationsRef.child(user.userId).push()
        item.setWithPriority(postData, 0 - Date.now())
        //Update badges
        this.badgesRef.child(user.userId).child('notificationsBadges').once('value', (badgeCount)=>{
          if (badgeCount.val()) badgeCount.ref.set(badgeCount.val() + 1)
          else badgeCount.ref.set(1)
        })
    }
    //Update the UI
    user.following = !user.following
    this.setState({users:user})
  }
  checkMessageLength (message) {
    return message.length > 350
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
            deleteKey: item.key,
            postUserId:item.userId,
            postId:item.postKey})
           this.deletePost()
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
                  <Text style={[styles.textColor, customStyles.username]}>{item.displayName}</Text>
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
            {this.checkMessageLength(item.post) ?
              <Text onPress={()=>Actions.post({postId:item.postKey})} style={[styles.textColor, customStyles.details]}>{item.post.substr(0, 350)}...Show More</Text> :
              <Text onPress={()=>Actions.post({postId:item.postKey})} style={[styles.textColor, customStyles.details]}>{item.post}</Text> }
          </View>
          <View style={customStyles.interactions}>
            <View style={{flex:1, alignItems:'flex-start',justifyContent:'flex-start'}}>
              <TButton style={[styles.textColor]} onPress={()=>this.onRowPress(index, item)}>
                {!item.postLike ? <Image source={require('../assets/images/heart2.png')} style={[customStyles.home, styles.iconColor]} /> :
              <Image source={require('../assets/images/heart2.png')} style={[customStyles.home,{tintColor: 'red' }]} />
            }
              <Text style={styles.textColor}>{item.starCount !== 0 && item.starCount}</Text>
            </TButton>
            </View>
            <View style={{flex:1, alignItems:'flex-end', justifyContent:'center',  marginRight:15}}>
              <TButton
                style={[styles.textColor]} onPress={()=>Actions.post({postId:item.postKey})}>
                <Image source={require('../assets/images/comments.png')} style={[customStyles.comment, styles.iconColor]} />
                <Text style={[{marginLeft:3}, styles.textColor]}>{item.comments !== 0 && item.comments}</Text>
            </TButton>
            </View>
          </View>
        </View>
       )
    }
  showModal () {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={[{flex:1}, styles.container]}>
            <View style={[{borderTopWidth:25}, styles.navBar]}>
              <TouchableHighlight onPress={()=>this.setState({modalVisible:false})}>
                <Icon name='times' type="FontAwesome" style={[styles.textColor, {margin:10}]} />
              </TouchableHighlight>
            </View>
            <View style={{flex:1, margin:10,}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image source={{uri:this.state.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
                  <Text style={[styles.textColor, customStyles.username]}>{this.state.displayName}</Text>
              </View>
              <Form>
                <Textarea onChangeText={(text) => this.setState({post:text})} style={{color:'white'}} placeholderTextColor={'white'} rowSpan={7} bordered placeholder="Write Something..." />
              </Form>
              <View style={{flex:1, padding:5, alignItems:'flex-end', margin:10}}>
              <Text onPress={()=>this.sharePost()} style={[{fontWeight:'500', padding:5, fontSize:20}, styles.textColor]}>Share</Text>
              </View>
            </View>
          </View>
        </Modal>
    )
  }
  sharePost () {
    if (this.state.post !== '') {
      var data = {
        userId:this.state.userId,
        displayName:this.state.displayName,
        profilePicture:this.state.profilePicture,
        post:this.state.post,
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        comments:0,
        starCount:0,
      }
      var postKey = this.postsRef.push(data).key
      var item = this.userPostsRef.child(this.state.userId).push()
      var key = item.key
      item.setWithPriority(postKey, 0 - Date.now())
      data['postKey'] = postKey
      data['key'] = key
      this.data.unshift(data)
      this.posts.unshift(data)
      this.state.followers.forEach((follower)=> {
        item = this.userPostsRef.child(follower.userId).push()
        item.setWithPriority(postKey, 0 - Date.now())
      })
      this.setState({post:'', posts:this.data, noActivity:false, modalVisible:false})
    }
  }
  header () {
    let {user} = this.state
      return (
        <Card style={[{flex:1,borderBottomWidth:1, padding:5, marginTop:-5}, styles.navBar]}>
          {this.state.refreshing ? <Spinner color="grey" /> :
            <View style={{flex:1}}>
              <View style={{justifyContent:'center', alignItems:'center'}}>
                <Image source={{uri:user.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
                <Text style={[styles.textColor, customStyles.username]}>{user.displayName}</Text>
              </View>
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', margin:5}}>
                <View style={{flex:2}}>
                  <Text style={[styles.textColor, customStyles.details, {fontStyle:'italic'}]}>@{user.username}</Text>
                  <Text style={[styles.textColor, customStyles.details]}>{user.college}</Text>
                  <Text style={[styles.textColor, customStyles.details, {fontStyle:'italic'}]}>Points: {user.points}</Text>
                </View>
                <View style={{flex:0.5}}></View>
                <View style={customStyles.usernameContainer}>
                  {(()=>{
                    if (user.userId !== this.state.userId && !user.following)
                      return (
                        <Button onPress={()=> this.followUser(user)} >
                        <Text style={[styles.textColor, customStyles.timestamp]}>Follow</Text>
                        </Button>
                      )
                    else if (user.userId !== this.state.userId && user.following)
                      return (
                        <Button danger onPress={()=> this.followUser(user)}>
                          <Text style={[styles.textColor, customStyles.timestamp]}>Unfollow</Text>
                        </Button>
                      )
                  })()}
                  <View style={{flex:1, justifyContent:'flex-end', alignItems:'flex-end'}}>
                    {this.state.postAvailable && <TouchableHighlight onPress={()=>this.setState({modalVisible:true})} style={{padding:5}}>
                      <Icon name='ios-create' style={[styles.textColor, {fontSize:35, padding:5}]} />
                    </TouchableHighlight>}
                  </View>
                </View>
              </View>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  {this.printStars(user)}
                </View>
            </View>}

        </Card>
      )
    }
  renderFlatList () {
     return (
       <View style={{flex:3}}>
         <FlatList
           data={this.state.posts}
           extraData={this.state}
           onScrollEndDrag={() => {this.setState({ isListScrolled: true }); }}
           onEndReachedThreshold={0.7}
           onEndReached={()=> this.loadMore()}
           ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
           renderItem={this.renderItem}
           refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
               onRefresh={this.retrievePosts.bind(this, this.state.currentUser)}
           />
          }
        />
         {(()=>{
           if (this.state.noActivity) return (
             <View style={{flex:1, justifyContent:'flex-start', alignItems:'center'}}>
               <Text style={[customStyles.listText, styles.textColor]}>No Posts</Text></View>
           )
         })()
       }
       </View>

     )
   }
  renderFollowers () {
     return (
       <View style={{flex:3}}>
         <FlatList
           data={this.state.followers}
           extraData={this.state}
           ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
           renderItem={this.renderUserItem}
           refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
               onRefresh={this.retrieveFollowers.bind(this, this.state.currentUser)}
           />
          }
        />
         {(()=>{
           if (this.state.noFollowers) return (
             <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
               <Text style={[customStyles.listText, styles.textColor]}>No Followers</Text></View>
           )
         })()
       }
       </View>
     )
   }
  renderFollowing () {
      return (
        <View style={{flex:3}}>
          <FlatList
            data={this.state.following}
            extraData={this.state}
            ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
            renderItem={this.renderUserItem}
            refreshControl={
             <RefreshControl
             refreshing={this.state.refreshing}
                onRefresh={this.retrieveFollowers.bind(this, this.state.currentUser)}
            />
           }
         />
          {(()=>{
            if (this.state.noFollowings) return (
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}>No Followers</Text></View>
            )
          })()
        }
        </View>
      )
    }
  renderUserItem = ({ item, index }) => {
      return (
       <TouchableHighlight
        style={customStyles.listItem} onPress={()=>Actions.user({userId:item.userId})}>
         <View style={customStyles.secondaryContainer}>
           <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
           <View style={customStyles.usernameContainer}>
             <Text style={[styles.textColor, customStyles.username]}>{item.displayName}</Text>
             <Text style={[styles.textColor, customStyles.details, {fontStyle:'italic'}]}>@{item.username}</Text>
             <Text style={[styles.textColor, customStyles.details]}>{item.college}</Text>
           </View>
           <View>
             {(()=>{
               if (item.userId !== this.state.userId && !item.following)
                 return (
                   <Button onPress={()=> this.followUser(item, index)} >
                   <Text style={[styles.textColor, customStyles.timestamp]}>Follow</Text>
                   </Button>
                 )
               else if (item.userId !== this.state.userId && item.following)
                 return (
                   <Button danger onPress={()=> this.followUser(item, index)}>
                     <Text style={[styles.textColor, customStyles.timestamp]}>Unfollow</Text>
                   </Button>
                 )
             })()}

           </View>
         </View>
      </TouchableHighlight>
        )
     }
  render () {
    return (
      <StyleProvider style={getTheme(platform)}>
      <View style={styles.container}>
        <View style={customStyles.container}>
          <NavBar backButton={this.props.backButton} />
          <View style={{flex:10}}>
            {this.header()}
            <View style={{flex:3, marginTop:-5}}>
              <Tabs initialPage={0} style={styles.container}>
                <Tab heading="Posts" style={styles.container}>
                  {this.renderFlatList()}
                </Tab>
                <Tab heading={"Followers (" + this.state.user.followers + ")"} style={styles.container}>
                  {this.renderFollowers()}
                </Tab>
                <Tab heading={"Following (" + this.state.user.followings + ")"} style={styles.container}>
                  {this.renderFollowing()}
                </Tab>
              </Tabs>
            </View>
          </View>
        </View>
           {this.showModal()}
       </View>
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
});
