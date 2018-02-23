import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
const firebase = require('firebase')

export default class Notification extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{}
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
    this.notificationsRef.child(userId).child(this.notifId).once('value', (notification) => {
      this.usersRef.child(notification.val().receiverId).child('profilePicture').once('value', (picture)=> {
        this.item = {
          post: notification.val().post,
          key:this.notifId,
          createdAt:notification.val().createdAt,
          code:notification.val().code,
          profilePicture:picture.val(),
        }
        this.setState({item:this.item})
      })


    })
  }
  render (){
    return <Comments item={this.state.item} user={true} />
  }
}
