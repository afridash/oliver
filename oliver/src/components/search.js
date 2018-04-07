import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import Star from 'material-ui/svg-icons/toggle/star'
import RaisedButton from 'material-ui/RaisedButton'
import StarHalf from 'material-ui/svg-icons/toggle/star-half'
import Person from 'material-ui/svg-icons/social/person-add'
import * as Notifications from '../auth/notifications'
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
export default class Search extends Component {
  constructor (props) {
    super (props)
    this.state = {
      users: [],
      index: 0,
      userId:'',
      user:'',
      searchText:this.props.match.params.id,
      loading:true,
      noResult:false,
    }
    this.users = []
    this.tempUsers = []
    this.followersRef = firebase.database().ref().child('followers')
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.notificationsRef = firebase.database().ref('notifications')
    this.badgesRef = firebase.database().ref().child('badges')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
      this.findUsers()
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }
  async findUsers () {
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
            if (!lastNames.exists() && !foundByUsername && !foundByDisplayName) this.setState({loading:false, noResult:true})
            lastNames.forEach((user)=> {
              this.listUser(user)
            })
          })
        })
      })
    }else{
      var collegeId = await localStorage.getItem('collegeId')
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
          followers:user.val().followers ? user.val().followers:0
        })
      }
      this.setState({users:this.users, loading:false, noResult:false})
    })
  }
  followUser (user, index) {
    if (user.following) {
      this.followersRef.child(user.userId).child(this.state.userId).remove()
      this.usersRef.child(user.userId).child('followers').once('value', (followers)=> {
        if (followers.exists()) followers.ref.set(followers.val() - 1)
      })
      user.followers = user.followers - 1
    }else {
        this.followersRef.child(user.userId).child(this.state.userId).set(true)
        this.usersRef.child(user.userId).child('followers').once('value', (followers)=> {
          if (followers.exists()) followers.ref.set(followers.val() + 1)
          else followers.ref.set(1)
        })
        user.followers = user.followers + 1
    }
    user.following = !user.following
    var clone = this.state.users
    clone[index] = user
    this.setState({users:clone})

    var postData = {
      userId: this.state.userId,
      profilePicture: this.state.profilePicture,
      displayName: this.state.displayName,
      type: 'follow',
      createdAt: firebase.database.ServerValue.TIMESTAMP
    }
    var item = this.notificationsRef.child(user.userId).push()
    item.setWithPriority(postData, 0 - Date.now())
    this.badgesRef.child(user.userId).child('notificationsBadges').once('value', (badgeCount)=>{
      if (badgeCount.val()) badgeCount.ref.set(badgeCount.val() + 1)
      else badgeCount.ref.set(1)
    })
  }
  spinner () {
     return (
       <div className='row text-center'>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
       </div>
     )
   }
  noActivity () {
     return (
       <div className='row text-center'>
         <div className='col-sm-6 col-sm-offset-3'>
           <br />  <br />
           <p className='text-info lead'>No Users Matching <i>{this.state.searchText}</i></p>
         </div>
         </div>
     )
   }
   //Add Course to firebase db only using their course name and code.
  printStars (user) {
    var items = []
    for (var i=0; i<user.stars; i++) {
       items.push(<Star style={{width:20, height:20, color:blue300}} />)
    }
    return items
  }
  showPageContent () {
    return this.state.users.map((user, key)=>
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
                        <p style={{fontSize:16, fontWeight:'600'}}>{user.displayName}</p>
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
    )
  }
  loadPageContent () {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <br/>
        <div style={{marginTop:60}}></div>
        {
          (()=>{
          if (this.state.loading){
            return this.spinner()
          }
          else if (this.state.noResult) {
            return this.noActivity()
          }
          else {
            return this.showPageContent()
          }
        })()
      }
      </div>
    )
  }
  onTextChange (text) {
    if (text === '') {
      this.setState({users:this.tempUsers})
    }else this.setState({searchText:text})
  }
  onSearch () {
    this.tempUsers = this.users
    this.users = []
    this.setState({loading:true})
    this.findUsers()
  }
  render () {
    return (
      <NavBar onSearch={this.onSearch.bind(this)} searchPage={true} onTextChange={this.onTextChange.bind(this)} children={this.loadPageContent()} />
      )
    }
  }
