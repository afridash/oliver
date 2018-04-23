import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Avatar from 'material-ui/Avatar'
import Star from 'material-ui/svg-icons/toggle/star'
import RaisedButton from 'material-ui/RaisedButton'
import StarHalf from 'material-ui/svg-icons/toggle/star-half'
import Dialog from 'material-ui/Dialog'
import Person from 'material-ui/svg-icons/social/person-add'
import Snackbar from 'material-ui/Snackbar'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as Notifications from '../auth/notifications'
import TextField from 'material-ui/TextField'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {Panel} from 'react-bootstrap'
import Firebase from '../auth/firebase'
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import FileReaderInput from 'react-file-reader-input'
import NavBar from './navBar'
import {
  blue300,
  red500,
} from 'material-ui/styles/colors'
const firebase = require('firebase')
const styles = {
  button:{
    float:'right',
    margin:5
  },
}
const muiTheme = getMuiTheme({
  tabs:{
        backgroundColor: '#2d6ca1',
      },
  inkBar: {
      backgroundColor: blue300
  },

})
export default class Profile extends Component {
  constructor (props){
    super(props)
    this.userId = this.props.match.params.id
    this.state = {
      loading:true,
      user:{},
      followers:[],
      following:[],
      open:false,
      colleges:[]
    }
    this.usersRef = firebase.database().ref().child('users')
    this.followersRef = firebase.database().ref().child('followers')
    this.followingRef = firebase.database().ref().child('following')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.collegesRef = firebase.database().ref().child('colleges')
    this.followers = []
    this.following = []
    this.colleges = []
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleOpen = () => {
    this.setState({open: true});
  }
  handleClose = () => {
    this.setState({open: false});
  }
  handleRequestClose = () => {
    this.setState({
      openSnack: false,
    })
  }
  handleTextChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  saveUserName () {
    this.usersRef.child(this.state.userId).update({username:this.state.username})
    let {user} = this.state
    user['username'] = this.state.username
    this.setState({
      editUsername:false,
      user

    })
  }
  componentDidMount () {
    this.collegesRef.once('value', (colleges)=> {
      colleges.forEach((college)=> {
        this.colleges.push({
          name:college.val().college,
          key:college.key
        })
      })
      this.setState({colleges:this.colleges})
    })
  }
  handleUser = (user) => {
    if (user) {
      if (this.userId !== undefined) {
        this.getUser(this.userId)
        this.retrieveFollowers(this.userId)
        this.retrieveFollowing(this.userId)
      }else{
        this.getUser(user.uid)
        this.retrieveFollowers(user.uid)
        this.retrieveFollowing(user.uid)
      }
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
    }
  }
  handleFileInput = (e, results) => {
    results.forEach(result => {
      const [e, file] = result;
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') this.setState({openSnack:true, message:'Unsupported file format'})
      else {
        let {user} = this.state
        user['profilePicture'] = e.target.result
        this.setState({attachment:e.target.result,mime:file.type, user:user, startUpload:true})
        //this.uploadCatalogue (e.target.result)
      }
    })
  }
  uploadProfile (file) {
    this.setState({openSnack:true, message:'Upload started'})
    const sessionId = new Date().getTime()
    var ref = firebase.storage().ref().child('users').child('profile').child(this.state.userId).child(`${sessionId}`)
    var uploadTask = ref.putString(file, 'data_url')
    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    this.setState({width:progress.toFixed(0)})
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        break;
      default: break;
    }
    }, function(error) {
    // Handle unsuccessful uploads
    }, (success) => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;

      let user = firebase.auth().currentUser
      user.updateProfile({
        photoURL:downloadURL
      }).then(()=> {
        this.usersRef.child(this.state.userId).update({
          profilePicture:downloadURL
        }).then(()=> {
          this.setState({openSnack:true, message:'Image Upload successful'})
        })
      })
    })
  }
  async getUser (userId) {
    this.usersRef.child(userId).once('value', (user)=> {
      this.listUser(user, 'users')
    })
  }
  retrieveFollowers (userId) {
    this.followersRef.child(userId).once('value', (followers)=> {
      if (!followers.exists()) this.setState({noFollowers:true})
      followers.forEach((follower)=> {
        this.usersRef.child(follower.key).once('value', (user)=>{
          this.listUser(user, 'followers')
        })
      })
    })
   }
   retrieveFollowing (userId) {
     this.followingRef.child(userId).once('value', (followers)=> {
       if (!followers.exists()) this.setState({noFollowers:true})
       followers.forEach((follower)=> {
         this.usersRef.child(follower.key).once('value', (user)=>{
           this.listUser(user, 'following')
         })
       })
     })
  }
  async listUser (user, type) {
     var temp = {}
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
         temp = {
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
         }
       }else{
         temp = {
           userId:user.key,
           displayName:user.val().displayName,
           profilePicture:user.val().profilePicture,
           college:user.val().college,
           username:user.val().username,
           completed:completed,
           points:points,
           followers:user.val().followers,
           stars:stars,
           following:false
         }
       }
       if (type === 'users') this.setState({user:temp, loading:false})
       else if (type === 'followers') {
         this.followers.push(temp)
         this.setState({followers:this.followers, loading:false})
       }else if (type === 'following') {
         this.following.push(temp)
         this.setState({following:this.following, loading:false})
       }
     })
   }
  followUser (user, index, type) {
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
     var clone = this.state[type]
     clone[index] = user
     this.setState({[type]:clone})
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
            <p className='text-info lead'>No Profile</p>
          </div>
          </div>
      )
    }
  printStars (user) {
      var items = []
      for (var i=0; i<user.stars; i++) {
         items.push(<Star style={{width:25, height:25, color:blue300}} />)
      }
      return items
    }
  showFollowers (follower, key, type) {
    return (
      <div style={{marginTop:20}}>
          <div className='col-sm-6'>
            <Paper key={key} zDepth={3}>
              <Panel>
                <div className="card">
                  <div className="card card-body">
                    <div className="row">
                      <div className="col-sm-12">
                          <div className='row'>
                            <div className='col-sm-3 col-xs-12 text-center'>
                              <img src={follower.profilePicture} className='img-thumbnail img-responsive' style={{width:100, height:100}} />
                              <p>
                                {follower.points === 0 && <StarHalf style={{width:25, height:25, color:blue300}} />}
                                {this.printStars(follower)}
                              </p>
                            </div>
                            <div className='col-sm-9 col-xs-12' style={{borderLeft:'1px solid red'}}>
                              <span className='pull-right'>
                                {(()=>{
                                  if (follower.userId !== this.state.userId && !follower.following)
                                    return (<RaisedButton labelStyle={{color:'white'}}
                                      buttonStyle={{backgroundColor:'#2d6ca1', borderColor:'white'}}
                                      label="Follow" style={styles.button}
                                      labelPosition="before"
                                      icon={<Person style={{width:20, height:20}} />}
                                      onClick={()=>this.followUser(follower, key, type)}/>
                                    )
                                  else if (follower.userId !== this.state.userId && follower.following)
                                    return (
                                      <RaisedButton labelStyle={{color:'white'}}
                                        buttonStyle={{backgroundColor:'red', borderColor:'white'}}
                                        label="Unfollow" style={styles.button}
                                        labelPosition="before"
                                        icon={<Person style={{width:20, height:20}} />}
                                        onClick={()=>this.followUser(follower, key, type)}/>
                                    )
                                })()}
                                </span>
                              <Link to={'/social/'+follower.userId} style={{textDecoration:'none'}}><p style={{fontSize:16, fontWeight:'600'}}>{follower.displayName}</p></Link>
                                <p style={{lineHeight:0.1, fontStyle:'italic'}}> @{follower.username}</p>
                                <p>{follower.college}</p>
                                <hr />
                                <p><span  style={{fontWeight:'600'}}>Sessions Completed: {follower.completed}</span> &nbsp;&nbsp;&nbsp;<span  style={{fontWeight:'600'}}>Points: {follower.points}</span>
                              &nbsp;&nbsp;<span style={{fontWeight:'600'}}>Followers: {follower.followers}</span></p>
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
      </div>
    )
  }
  selectUniversity (college) {
    let {user} = this.state
    user['college'] = college.name
    this.usersRef.child(user.userId).update({college:college.name, collegeId:college.key})
    localStorage.setItem('collegeId',college.key)
    this.handleClose()
    this.setState({user:user, openSnack:true, message:'University was successfully updated'})
  }
  showPageContent () {
    const {user} = this.state
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ]
    return (
      <div className='col-sm-10 col-sm-offset-1'>
        <div className="col-sm-12">
        <Panel>
          <div className="col-sm-12">
              <div className='row'>
                <div className='col-sm-12 text-center'>
                  <Avatar
                    src={user.profilePicture}
                    size={90}
                  />
                  <p>
                    {user.userId === this.state.userId && <div>
                      {this.state.startUpload ?
                        <span onClick={()=>this.uploadProfile(user.profilePicture)} style={{color:blue300, fontSize:12, cursor:'pointer'}}>Upload</span> :
                        <FileReaderInput as="url" id="my-file-input" onChange={this.handleFileInput}>
                        <div style={{margin:10, cursor:'pointer'}}>
                          <span style={{color:blue300, fontSize:12, cursor:'pointer'}}>Edit</span>
                        </div>
                      </FileReaderInput>}
                    </div>}
                    {user.points === 0 && <StarHalf style={{width:25, height:25, color:blue300}} />}
                    {this.printStars(user)}
                  </p>

                </div>
                <div className='col-sm-12'>
                  <span className='pull-right'>
                    {(()=>{
                      if (user.userId !== this.state.userId && !user.following)
                        return (<RaisedButton labelStyle={{color:'white'}}
                          buttonStyle={{backgroundColor:'#2d6ca1', borderColor:'white'}}
                          label="Follow" style={styles.button}
                          labelPosition="before"
                          icon={<Person style={{width:20, height:20}} />}
                          onClick={()=>this.followUser(user)}/>
                        )
                      else if (user.userId !== this.state.userId && user.following)
                        return (
                          <RaisedButton labelStyle={{color:'white'}}
                            buttonStyle={{backgroundColor:'red', borderColor:'white'}}
                            label="Unfollow" style={styles.button}
                            labelPosition="before"
                            icon={<Person style={{width:20, height:20}} />}
                            onClick={()=>this.followUser(user)}/>
                        )
                    })()}
                    </span>
                  <p style={{fontSize:16, fontWeight:'600'}}>{user.displayName}</p>
                    {this.state.editUsername ? <div>
                      <TextField
                        hintText={user.username}
                        fullWidth={true}
                        name='username'
                        floatingLabelText={user.username}
                        className='text-center'
                        onChange = {this.handleTextChange}
                      />
                      <span style={{color:blue300, fontSize:12, cursor:'pointer', padding:10}} onClick={()=>this.saveUserName()}>Save</span>
                      <span style={{color:red500, fontSize:12, cursor:'pointer', padding:10}} onClick={()=>this.setState({editUsername:false})}>Cancel</span>
                    </div> :
                      <p style={{lineHeight:0.1, fontStyle:'italic'}}> @{user.username} {user.userId === this.state.userId && <span style={{color:blue300, fontSize:10, cursor:'pointer'}} onClick={()=>this.setState({editUsername:true})}>Edit</span>}</p>
                    }
                    <p>{user.college} {user.userId === this.state.userId && <span style={{color:blue300, fontSize:10, cursor:'pointer'}} onClick={this.handleOpen}>Change</span>}</p>
                    <Dialog
                      title="Select University"
                      actions={actions}
                      modal={false}
                      open={this.state.open}
                      onRequestClose={this.handleClose}
                      autoScrollBodyContent={true}
                      >
                        {this.state.colleges.map((college)=>
                          <div onClick={()=>this.selectUniversity(college)} style={{padding:10, borderBottom:'1px solid', cursor:'pointer'}}>
                            <p>{college.name}</p>
                          </div>
                        )}
                      </Dialog>
                    <hr />
                    <p><span  style={{fontWeight:'600'}}>Sessions Completed: {user.completed}</span> &nbsp;&nbsp;&nbsp;<span  style={{fontWeight:'600'}}>Points: {user.points}</span></p>
                </div>
              </div>
          </div>
        </Panel>
      </div>
      <div className='col-sm-12'>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          name='value'
          >
            <Tab label="Followers" value="a">
              {this.state.followers.map((follower, key)=>
                this.showFollowers(follower, key, 'followers')
              )}
            </Tab>
            <Tab label="Following" value="b">
              {this.state.following.map((following, key)=>
                this.showFollowers(following, key, 'following')
              )}
            </Tab>
          </Tabs>
      </div>
      </div>
    )
  }
  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className="row">
        <br/>
        <div style={{marginTop:60}}></div>
        <Snackbar
          open={this.state.openSnack}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
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
    </MuiThemeProvider>
    )
  }
}
