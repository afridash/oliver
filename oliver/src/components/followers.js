import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import Star from 'material-ui/svg-icons/toggle/star'
import RaisedButton from 'material-ui/RaisedButton'
import StarHalf from 'material-ui/svg-icons/toggle/star-half'
import Person from 'material-ui/svg-icons/social/person-add'
import * as Notifications from '../auth/notifications'
import {Link} from 'react-router-dom'
import {Panel} from 'react-bootstrap'
import Firebase from '../auth/firebase'
import NavBar from './navBar'
import {
  blue300,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const styles = {
  button:{
    float:'right',
    margin:5
  },
}
export default class Followers extends Component {
  constructor (props) {
    super (props)
    this.state = {
      users:[],
      loading:true
    }
    this.users = []
    this.userId = this.props.match.params.id
    this.followersRef = firebase.database().ref().child('followers')
    this.followingRef = firebase.database().ref().child('following')
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.badgesRef = firebase.database().ref().child('badges')
    this.notificationsRef = firebase.database().ref().child('notifications')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {
      if (this.userId !== undefined) {
        this.retrieveFollowers(this.userId)
      }else{
        this.retrieveFollowers(user.uid)
      }
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
    }
  }
  retrieveFollowers (userId) {
    this.followersRef.child(userId).once('value', (followers)=> {
      if (!followers.exists()) this.setState({loading:false, noActivity:true})
      followers.forEach((follower)=> {
        this.usersRef.child(follower.key).once('value', (user)=>{
          this.listUser(user)
        })
      })
    })
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
        Notifications.sendUserNotification(user.userId, 'follow', this.state.userId)
    }
    //Update the UI
    user.following = !user.following
    var clone = this.state.users
    clone[index] = user
    this.setState({users:clone})
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
          userId:user.key,
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          followers:user.val().followers,
          stars:stars,
          following:true
        })
      }else{
        this.users.push({
          userId:user.key,
          displayName:user.val().displayName,
          profilePicture:user.val().profilePicture,
          college:user.val().college,
          username:user.val().username,
          completed:completed,
          points:points,
          followers:user.val().followers ? user.val().followers : 0,
          stars:stars,
          following:false
        })
      }
        this.setState({users:this.users, loading:false, noActivity:false})
    })
  }
  printStars (user) {
      var items = []
      for (var i=0; i<user.stars; i++) {
         items.push(<Star style={{width:20, height:20, color:blue300}} />)
      }
      return items
    }
  spinner () {
      return (
        <div className="row text-center">
            <br />
            <br />
            <CircularProgress size={60} thickness={5} />
        </div>
      )
    }
  noActivity () {
      return  (
        <div className='row text-center'>
          <div className='col-sm-6 col-sm-offset-3'>
            <br />  <br />
            <p className='text-info lead'>No Followers</p>
          </div>
          </div>
      )
    }
  showPageContent () {
      return this.state.users.map((user, key)=>
      <div className='col-sm-6'>
        <Paper key={key} zDepth={3}>
          <Panel>
            <div className="card">
              <div className="card card-body">
                <div className="row">
                  <div className="col-sm-12">
                      <div className='row'>
                        <div className='col-sm-2 col-xs-12 text-center'>
                          <img src={user.profilePicture} className='img-thumbnail img-responsive' style={{width:100, height:100}} />
                          <p>
                            {user.points === 0 && <StarHalf style={{width:20, height:20, color:blue300}} />}
                            {this.printStars(user)}
                          </p>
                        </div>
                        <div className='col-sm-10 col-xs-12' style={{borderLeft:'1px solid red'}}>
                          <span className='pull-right'>
                            {(()=>{
                              if (user.userId !== this.state.userId && !user.following)
                                return (<RaisedButton labelStyle={{color:'white'}}
                                  buttonStyle={{backgroundColor:'#2d6ca1', borderColor:'white'}}
                                  label="Follow" style={styles.button}
                                  labelPosition="before"
                                  icon={<Person style={{width:20, height:20}} />}
                                  onClick={()=>this.followUser(user, key)}/>
                                )
                              else if (user.userId !== this.state.userId && user.following)
                                return (
                                  <RaisedButton labelStyle={{color:'white'}}
                                    buttonStyle={{backgroundColor:'red', borderColor:'white'}}
                                    label="Unfollow" style={styles.button}
                                    labelPosition="before"
                                    icon={<Person style={{width:20, height:20}} />}
                                    onClick={()=>this.followUser(user, key)}/>
                                )
                            })()}
                            </span>
                          <Link to={'/social/'+user.userId} style={{textDecoration:'none'}}><p style={{fontSize:16, fontWeight:'600'}}>{user.displayName}</p></Link>
                            <p style={{lineHeight:0.1, fontStyle:'italic'}}> @{user.username}</p>
                            <p>{user.college}</p>
                            <hr />
                            <p><span  style={{fontWeight:'600'}}>Sessions Completed: {user.completed}</span> &nbsp;&nbsp;&nbsp;<span  style={{fontWeight:'600'}}>Points: {user.points}</span>
                          &nbsp;&nbsp;<span style={{fontWeight:'600'}}>Followers: {user.followers}</span></p>
                        </div>
                      </div>
                  </div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </Panel>
        </Paper>
      </div>
      )
    }
  render () {
    return (
      <div className="row">
        <br/>
        <div style={{marginTop:60}}></div>
        {
          (()=>{
          if (this.state.loading){
            return this.spinner()
          }
          else if (this.state.noActivity) {
            return this.noActivity()
          }
          else {
            return <div style={{margin:10}}>{this.showPageContent()}</div>
          }
        })()
      }
      </div>
    )
  }
}
