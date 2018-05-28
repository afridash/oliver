import React from 'react';
import theme, { styles } from 'react-native-theme'
import {
  StyleSheet,
  View ,
  Image,
  TouchableHighlight,
  Platform,
  TextInput,
  AsyncStorage,
  FlatList,
  RefreshControl,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Text, Icon, Button} from 'native-base'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import NavBar from './navBar'
export default class Search extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      users: [],
      index: 0,
      userId:'',
      user:'',
      loading:true,
      noResult:false,
      refreshing:false,
    }
    this.users = []
    this.tempUsers = []
    this.followersRef = firebase.database().ref().child('followers')
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.notificationsRef = firebase.database().ref('notifications')
    this.followingRef = firebase.database().ref().child('following')
    this.badgesRef = firebase.database().ref().child('badges')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  handleUser = (user) => {
    if (user) {
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
      this.findUsers()
    }
  }
  async findUsers () {
    this.users = []
    this.setState({refreshing:true})
    if (this.state.searchText) {
      var foundByDisplayName = true
      var foundByUsername = true
      await this.usersRef.orderByChild('displayName').startAt(this.state.searchText).endAt(this.state.searchText+'\uf8ff').once('value', (users)=>{
        if (!users.exists()) foundByDisplayName = false
        users.forEach((user)=> {
          this.listUser(user)
        })
        this.usersRef.orderByChild('username').startAt(this.state.searchText).endAt(this.state.searchText+'\uf8ff').once('value', (usernames)=>{
          if (!usernames.exists()) foundByUsername = false
          usernames.forEach((user)=> {
            this.listUser(user)
          })
          this.usersRef.orderByChild('lastName').startAt(this.state.searchText).endAt(this.state.searchText+'\uf8ff').once('value', (lastNames)=>{
            if (!lastNames.exists() && !foundByUsername && !foundByDisplayName) this.setState({loading:false, noResult:true, refreshing:false})
            lastNames.forEach((user)=> {
              this.listUser(user)
            })
          })
        })
      })
    }else{
      var collegeId = await AsyncStorage.getItem('collegeId')
      this.usersRef.orderByChild('collegeId').equalTo(collegeId).limitToFirst(50).once('value', (users)=> {
        users.forEach((user)=> {
          this.listUser(user)
        })
      })
    }
  }
  async listUser (user) {
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
        this.users.push({
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          userId:user.key,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          stars:stars,
          following:true,
          key:user.key,
          followers:user.val().followers ? user.val().followers:0
        })
      }else{
        this.users.push({
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          userId:user.key,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          stars:stars,
          following:false,
          followers:user.val().followers ? user.val().followers:0,
          key:user.key
        })
      }
      this.setState({users:this.users, loading:false, noResult:false, refreshing:false})
    })
  }
  search(text) {
     //Search for user entry using the second variable that the courses are stored in.
     //Filter each and return those that contain the searched string
    this.setState({searchText:text})
   }
  followUser (user, index) {
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
     var clone = this.state.users
     clone[index] = user
     this.setState({users:clone})
   }
  renderItem = ({ item, index }) => {
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
  renderFlatList () {
     return (
       <FlatList
         data={this.state.users}
         extraData={this.state}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.findUsers.bind(this)}
         />
        }
    />
     )
   }
  render() {
    return (
        <View style={styles.container}>
          <View style={customStyles.container}>
            <View style={[customStyles.inputContainer, styles.navBar]} >
              <TextInput
                style={customStyles.input}
                placeholder='Search Users'
                onChangeText={(text) => { this.search(text) }}
                returnKeyType="go"
                onSubmitEditing={()=>this.findUsers()}
              />
            </View>
            <View style={{flex:10}}>
              {(()=>{
                if (this.state.noResult) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>No Match Found</Text></View>)
                else return this.renderFlatList()
              })()
            }
            </View>
          </View>
         </View>

    );
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
  listText:{
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
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
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  profilePicture:{
    width:50,
    height:50,
    borderRadius:25,
    borderColor:'white',
    borderWidth:1,
  },
  details:{
    marginLeft:10,
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  username:{
    marginLeft:10,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
});
