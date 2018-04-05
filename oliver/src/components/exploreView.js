import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
import CircularProgress from 'material-ui/CircularProgress'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
const firebase = require('firebase')

export default class ExploreView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{},
      loading:true,
      noActivity:false
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
      if (!post.exists()) {
        this.setState({loading:false, noActivity:true})
        return null
      }
      this.item = {
        post: post.val().message + '...' + post.val().percentage + '% in ' + post.val().course + ' (' + post.val().courseCode + ')',
        createdAt:post.val().createdAt,
        code:post.val().username,
        profilePicture:post.val().profilePicture,
        userId:post.val().userId
      }
      this.setState({
        item:this.item, loading:false, noActivity:false})
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
    else return <Comments userId={true} itemKey={this.exploreId} item={this.state.item} user={true}/>
  }
}
