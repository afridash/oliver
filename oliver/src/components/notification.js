import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
import CircularProgress from 'material-ui/CircularProgress'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
const firebase = require('firebase')

export default class Notification extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{},
      postId:'',
      loading:true,
      noActivity:false
    }
    this.notifId = this.props.match.params.id
    this.usersRef = firebase.database().ref().child('users')
    this.notificationsRef = firebase.database().ref().child('notifications')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user)
    this.getNotificationInfo(user.uid)
  }
  getNotificationInfo (userId) {
    var userId
    this.notificationsRef.child(userId).child(this.notifId).once('value', (notification) => {
      if (!notification.exists()) {
        this.setState({loading:false,noActivity:true})
        return null
      }
      if (notification.val().type === 'explore_like') {
        userId = notification.val().receiverId
      }else {
        userId = notification.val().course
      }
      if (userId !== '' && userId !== undefined) {
        this.usersRef.child(userId).child('profilePicture').once('value', (picture)=> {
          this.item = {
            post: notification.val().post,
            key:this.notifId,
            createdAt:notification.val().createdAt,
            code:notification.val().code,
            profilePicture:picture.val(),
            userId:userId
          }
          if (notification.val().course !== '') {
            this.setState({userId:true})
          }else {
            this.setState({userId:false})
          }
          this.setState({item:this.item, postId:notification.val().postId, loading:false, noActivity:false})
        })
      }else {
        this.item = {
          post: notification.val().post,
          key:this.notifId,
          createdAt:notification.val().createdAt,
          code:notification.val().code,
          profilePicture:'',
          userId:userId
        }
        this.setState({item:this.item, postId:notification.val().postId, userId:false, loading:false, noActivity:false})
      }
    })
  }
  spinner () {
     return (
       <div className='row text-center'>
         <div style={{marginTop:60}}></div>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
       </div>
     )
   }
  noActivity () {
     return (
       <div className='row text-center'>
         <div style={{marginTop:60}}></div>
         <div className='col-sm-6 col-sm-offset-3'>
           <br />  <br />
           <p className='text-info lead'>Item not found...</p>
           <Link to={"/AppHome"}>
             <RaisedButton label="Return Home" primary={true} fullWidth={true}/>
           </Link>
         </div>
         </div>
     )
   }
  render (){
    if (this.state.loading)
      return this.spinner()
    else if (this.state.noActivity)
      return this.noActivity()
    else
     return <Comments userId={this.state.userId} itemKey={this.state.postId} item={this.state.item} user={true} />
  }
}
