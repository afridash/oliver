import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
const firebase = require('firebase')

export default class ExploreView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{},
    }
    this.exploreId = this.props.match.params.id
    this.notificationsRef = firebase.database().ref().child('notifications')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user)
    this.getNotificationInfo(user.uid)
  }
  getNotificationInfo (userId) {
    this.notificationsRef.child(userId).child(this.exploreId).once('value', (notification) => {
      this.setState({item:notification.val()})
    })
  }
  render (){
    return <Comments item={this.state.item}/>
  }
}
