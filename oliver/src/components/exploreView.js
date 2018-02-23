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
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.usersRef = firebase.database().ref().child('users')
    this.exploreRef = firebase.database().ref().child('explore')

  }
  handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
         this.getPost(college.val())
       })
     }
   }
  getPost (college) {
    this.exploreRef.child(college).child(this.exploreId).once('value', (post) => {
      this.item = {
        post: post.val().message + '...' + post.val().percentage + '% in ' + post.val().course + ' (' + post.val().courseCode + ')',
        createdAt:post.val().createdAt,
        code:post.val().username,
        profilePicture:post.val().profilePicture,
      }
      this.setState({
        item:this.item})
    })
  }
  render (){
    return <Comments item={this.state.item} user={true}/>
  }
}
