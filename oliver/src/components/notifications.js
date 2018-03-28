import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import * as timestamp from '../auth/timestamp'
import {Link, Redirect} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap'
import Remove from 'material-ui/svg-icons/content/delete-sweep';
const firebase = require('firebase')

class Notifications extends Component {
  constructor(props){
    super(props);

    this.state = {
      userId:'',
      notifications: [],
      loading: true,
      noNotifications: false,
      next:false,
      current:0,
      counter:0,
    }
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.notificationsRef = firebase.database().ref().child('notifications')
    this.increment = 14
    this.data = []
  }

  handleUser = (user) => {
    if (user) {
      this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
      this.retrieveNotifications(user.uid)
    }
  }

  async retrieveNotifications (userId) {
    this.notifications = []
    await this.notificationsRef.child(userId).once('value', (snapshots) =>{
      if(!snapshots.exists())this.setState({noNotifications:true, loading:false})
      snapshots.forEach((snapshot)=>{
        this.notifications.push({key:snapshot.key, displayName:snapshot.val().displayName,
           type:snapshot.val().type, postId:snapshot.val().postId,profilePicture:snapshot.val().profilePicture,
           userId:snapshot.val().userId, createdAt:snapshot.val().createdAt, post:snapshot.val().post,
           username:snapshot.val().code, courseId:snapshot.val().course})
      })
    })
    await  this.notifications.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
    this.showNextSet()
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.notifications[i])
       this.setState({notifications:this.data, loading:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
     if (this.state.counter + this.increment > this.notifications.length-1){
       await this.setState({current:this.state.counter, counter:this.notifications.length-1, next:false,})
     }else {
         await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
     }
     await this.getNextSet()
   }
  showExploreVote (notification, index, message) {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <br/>
        <br/>
          <Paper zDepth={3}>
            <Panel>
              <div className="card">
                <div className="card-header">
                  <span style={{marginTop:-20}} className="pull-right text-center">
                    <IconButton tooltip="Remove" onClick={()=> this.handleDelete(notification.key)}>
                      <Remove />
                    </IconButton>
                  </span>
                </div>
                <br/>
                <div className="card card-body">
                  <div className="row">
                    <div className="col-sm-2">
                      <Avatar
                        src={notification.profilePicture}
                        size={60}
                      />
                    </div>
                    <div className="col-sm-10" style={{cursor:'pointer'}}>
                      <Link style={{textDecoration:'none'}} to={'/notifications/'+ notification.key}>
                        <span className='lead'> {notification.displayName} {message}</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="pull-right">{timestamp.timeSince(notification.createdAt)}</span>
                </div>
              </div>
            </Panel>
          </Paper>
      </div>
    )
  }
  showTheoryVote (notification, index, message) {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <br/>
        <br/>
          <Paper zDepth={3}>
            <Panel>
              <div className="card">
                <div className="card-header">
                  <span className="pull-right">
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                      <i className="fa fa-trash-o fa-lg" style={{cursor:'pointer'}} onClick={()=> this.handleDelete(notification.key)}></i>
                    </OverlayTrigger>
                  </span>
                </div>
                <br/>
                <div className="card card-body">
                  <div className="row">
                    <div className="col-sm-2">
                      <Avatar
                        src={notification.profilePicture}
                        size={60}
                      />

                    </div>
                    <div className="col-sm-10" stle={{curosr:'pointer'}}>
                      <Link style={{textDecoration:'none'}} to={'/notifications/'+ notification.key}>
                        <h4>{notification.displayName} {message}</h4>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="pull-right">{timestamp.timeSince(notification.createdAt)}</span>
                </div>
              </div>
            </Panel>
          </Paper>
      </div>
    )
  }
  renderItem(item, index) {
    if (item.type === 'upvote') return this.showExploreVote(item, index, 'upvoted your comment')
    else if (item.type === 'downvote') return this.showExploreVote(item, index, 'downvoted your comment')
    else if (item.type === 'explore_like') return this.showExploreVote(item, index, 'liked your post on explore')
    else if (item.type === 'explore_comment') return this.showExploreVote(item, index, 'commented on an explore post')
    else if (item.type === 'explore_mention') return this.showExploreVote(item, index, 'replied to your comment')
    else if (item.type === 'upvote_theory') return this.showTheoryVote(item, index, 'upvoted your comment to a question')
    else if (item.type === 'downvote_theory') return this.showTheoryVote(item, index, 'downvoted your comment to a question')
    else if (item.type === 'downvote_theory') return this.showTheoryVote(item, index, 'downvoted your comment to a question')
    else if (item.type === 'theory_comment') return this.showTheoryVote(item, index, 'commented on a question you follow')
    else if (item.type === 'theory_mention') return this.showTheoryVote(item, index, 'replied to your comment on a question')
  }
  showPageContent () {
    return this.state.notifications.map((notification, key) => {
      return this.renderItem(notification, key)
    })
  }
  noNotifications () {
    return (
      <div className="col-sm-4 col-sm-offset-4">
        <p style={{color:'red', fontSize:'20'}}>You Have No Notification!</p>
      </div>
    )
  }
  spinner () {
    return (
      <div className="row text-center">
        <div className="col-md-6 col-md-offset-3">
          <br/>
          <br/>
          <CircularProgress size={60} thickness={5} />
        </div>
      </div>
    )
  }
  handleDelete (key) {
    //Delete entry with userId and key of entry
   this.notificationsRef.child(this.state.userId).child(key).remove()
   //Filter notifications and return items whose key is not equal to item deleted
   this.notifications = this.notifications.filter ((notification)=> notification.key !== key)
   //update state with remaining items
   this.setState({notifications:this.notifications})
   }
  render () {
    return(
      <div className="center">
        <div className="row">
          <div style={{marginTop:60}}></div>
          {
            (()=>{
              if (this.state.loading){
                return this.spinner()
              }
              else if (this.state.noActivities) {
                return this.noNotifications()
              }
              else {
                return this.showPageContent()
              }
            })()
          }
        </div>
        <div className='col-sm-12 text-center'>
          {this.state.next && <RaisedButton className='text-center' label="Show More" primary={true} onClick={()=>{this.showNextSet()}}/>}
        </div>
      </div>
      );
    }

  }

export default Notifications;

const tooltip = (
  <Tooltip id="tooltip">Delete</Tooltip>
);
