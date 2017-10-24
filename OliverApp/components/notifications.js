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
import {
  AdMobBanner,
 } from 'react-native-admob'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Swipeable from 'react-native-swipeable'
import NavBar from './navBar'
import * as timestamp from '../auth/timestamp'
export default class Notifications extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data: [],
      refreshing: false,
      swipingStarted:false,
      isLoading:true,
      noNotifications:false,
      status:''
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('notifications')
    this.rightButtons = [<Text onPress={()=>this.handleSwipeClick()} style={customStyles.swipeButton}>Delete</Text>,]
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    var status = await AsyncStorage.getItem('status') //Check the internet status
    this.setState({userId:key, status})
    if (currentUser === key)
    this.retrieveNotificationsOffline()
    else this.retrieveNotificationsOnline()
  }
  async retrieveNotificationsOffline () {
    //Retrieve and parse stored data in AsyncStorage
    //If no such data, read bookmarked questions from firebase, then store them locally
    var notifications = []
    var stored = await AsyncStorage.getItem("notifications")
    if (stored !== null && stored !== '1') notifications = JSON.parse(stored)
    if (notifications.length === 0 || notifications === null) {
      this.retrieveNotificationsOnline()
    }else{
      this.data = notifications
      this.setState({data:notifications, isLoading:false, noNotifications:false})
      this.checkInternetStatus()
    }
  }
  async checkInternetStatus () {
    //Reload notifictions if there is internet status
    if (this.state.status === 'true') {
      this.retrieveNotificationsOnline ()
    }
  }
  retrieveNotificationsOnline () {
    AsyncStorage.setItem('currentUser', this.state.userId)
    this.data = []
    this.setState({refreshing:true,})
    this.ref.child(this.state.userId).once('value', (snapshots)=>{
      if (!snapshots.exists()) this.setState({refreshing:false, isLoading:false, noNotifications:true})
      snapshots.forEach((childSnap)=>{
          this.data.push({key:childSnap.key, displayName:childSnap.val().displayName,
            type:childSnap.val().type, postId:childSnap.val().postId,profilePicture:childSnap.val().profilePicture,
            userId:childSnap.val().userId, createdAt:childSnap.val().createdAt, post:childSnap.val().post,
            username:childSnap.val().code, courseId:childSnap.val().course})
          this.setState({data:this.data, refreshing:false, isLoading:false})
          AsyncStorage.setItem('notifications', JSON.stringify(this.data))
      })
    })
  }
  handleSwipeClick () {
    //Delete row that has been clicked on after swiping
    var rem = this.state.data.splice(this.state.activeRow,1)
    this.setState({data:this.state.data})
    AsyncStorage.setItem('notifications', JSON.stringify(this.state.data))
    this.ref.child(this.state.userId).child(this.state.deleteRef).remove()
  }
  showTheoryVote (item, index, message) {
    return (
     <View
      style={customStyles.listItem}
    >
      <Swipeable onRightActionRelease={()=>this.setState({activeRow:index, deleteRef:item.key})}
        rightActionActivationDistance={100} onRef={ref => this.swipeable = ref} rightButtons={this.rightButtons}
         onSwipeStart={()=>this.setState(prevState =>({swipingStarted:!prevState.swipingStarted}))} onSwipeComplete={()=>this.setState(prevState =>({swipingStarted:!prevState.swipingStarted}))}>
      <TouchableWithoutFeedback onPress={()=>Actions.viewTheory({questionId:item.postId, question:item.post, courseCode:item.username, courseId:item.courseId, answer:''})} style={{flex:1}}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
           <Image source={{uri:item.profilePicture}} style={customStyles.profilePicture} resizeMode={'cover'}/>
           <View style={{flex:1}}>
             <Text style={[customStyles.listText, styles.textColor]}>{item.displayName} {message}</Text>
           </View>
           <Text style={[customStyles.timestamp, styles.textColor]}>{timestamp.timeSince(item.createdAt)}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
    </View>
      )
  }
  showExploreVote (item, index, message) {
    return (
     <View
      style={customStyles.listItem}
    >
      <Swipeable onRightActionRelease={()=>this.setState({activeRow:index, deleteRef:item.key})}
        rightActionActivationDistance={100} onRef={ref => this.swipeable = ref} rightButtons={this.rightButtons}
         onSwipeStart={()=>this.setState(prevState =>({swipingStarted:!prevState.swipingStarted}))} onSwipeComplete={()=>this.setState(prevState =>({swipingStarted:!prevState.swipingStarted}))}>
      <TouchableWithoutFeedback onPress={()=>Actions.viewTheory({questionId:item.postId, question:item.post, courseCode:item.username, comments:true, userId:item.courseId})} style={{flex:1}}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
           <Image source={{uri:item.profilePicture}} style={customStyles.profilePicture} resizeMode={'cover'}/>
           <View style={{flex:1}}>
             <Text style={[customStyles.listText, styles.textColor]}>{item.displayName} {message}</Text>
           </View>
           <Text style={[customStyles.timestamp, styles.textColor]}>{timestamp.timeSince(item.createdAt)}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
    </View>
      )
  }
  renderItem({ item, index }) {
    if (item.type === 'upvote') return this.showExploreVote(item, index, 'upvoted your comment')
    else if (item.type === 'downvote') return this.showExploreVote(item, index, 'downvoted your comment')
    else if (item.type === 'explore_like') return this.showExploreVote(item, index, 'liked your post on explore')
    else if (item.type === 'explore_comment') return this.showExploreVote(item, index, 'commented on an explore post')
    else if (item.type === 'upvote_theory') return this.showTheoryVote(item, index, 'upvoted your comment to a question')
    else if (item.type === 'downvote_theory') return this.showTheoryVote(item, index, 'downvoted your comment to a question')
    else if (item.type === 'downvote_theory') return this.showTheoryVote(item, index, 'downvoted your comment to a question')
    else if (item.type === 'theory_comment') return this.showTheoryVote(item, index, 'commented on a question you follow')
   }
   bannerError = (e) => {
     //Failed to load banner
   }
   renderFlatList () {
     return (
       <FlatList
         scrollEnabled={!this.state.swipingStarted}
         data={this.state.data}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.retrieveNotificationsOnline.bind(this)}
         />
        }
    />
     )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Notifications' />
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noNotifications) return (
                <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={[customStyles.listText, styles.textColor]}>No Notifications</Text></View>
                </View>
              )
              else return this.renderFlatList()
            })()
          }
          </View>
          <AdMobBanner
           adSize="smartBannerPortrait"
           adUnitID="ca-app-pub-1090704049569053/1792603919"
           testDeviceID="EMULATOR"
           didFailToReceiveAdWithError={this.bannerError} />
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
    padding:15,
  },
  listText:{
    fontSize:14,
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
  timestamp:{
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
})
