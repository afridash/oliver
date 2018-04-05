import React, {Component} from 'react'
import * as timestamp from '../auth/timestamp'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import Arrow from 'material-ui/svg-icons/navigation/expand-more'
import ArrowDownward from 'material-ui/svg-icons/action/thumb-down'
import ArrowUpward from 'material-ui/svg-icons/action/thumb-up'
import Message from 'material-ui/svg-icons/content/send'
import Reply from 'material-ui/svg-icons/content/reply'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Panel} from 'react-bootstrap'
import * as Notifications from '../auth/notifications'
import Firebase from '../auth/firebase'
import * as TimeStamp from '../auth/timestamp'
import {
  blue300,
} from 'material-ui/styles/colors'
const firebase = require('firebase')
const styles = {
  labelStyle: {
    color: 'white',
  },
  underlineStyle: {
    borderColor: '#2d6ca1',
  },
};

export default class Comments extends Component {
  constructor (props) {
    super (props)
    this.state = {
      comments: [],
      tagged: [],
      index: 0,
      userId:'',
      followers: [],
      username:'',
      user:'',
      name:'Richard Igbiriki',
      comment:'',
      following:false
    }
    this.commentsRef = firebase.database().ref().child('answers').child(this.props.itemKey)
    this.upvoteRef = firebase.database().ref().child('upvotes')
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
    this.questionsRef = firebase.database().ref().child('questions')
    this.exploreRef = firebase.database().ref().child('explore')
    this.followersRef = firebase.database().ref().child('question_followers').child(this.props.itemKey)
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('student_stats')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.data = []
    this.tagged = []
  }
  handleUser = async (user) => {
    if (user) {
      this.usersRef.child(user.uid).child('username').once('value', async (username)=> {
        var collegeId = await localStorage.getItem('collegeId')
        await this.setState({userId:user.uid, user:user.displayName, username:username.val(), profilePicture:user.photoURL, collegeId:collegeId})
        this.retrieveComments()
        this.retrieveFollowers()
        this.followersRef.child(user.uid).once('value', (following)=>{
          if (following.exists()) this.setState({following:true})
          else this.setState({following:false})
        })
      })
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleClick = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }
  handleClickComment (event, key) {
    this.setState({
      openComment: true,
      anchorComment: event.currentTarget,
      deleteKey: key
    })
  }
  handleRequestClose = () => {
   this.setState({
     open: false,
     openComment:false,
   })
  }
  handleTextChange = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }
  async retrieveComments () {
    this.setState({refreshing:true, noQuestions:false})
    //Fetch one result to confirm that comments exists
    this.commentsRef.limitToFirst(1).once('value', (snapshot)=>{
      if (!snapshot.exists()) this.setState({isLoading:false, refreshing:false})
    })
    //Retrieve all comments
     this.commentsRef.on('child_added', (snapshot)=>{
       this.upvoteRef.child(snapshot.key).child(this.state.userId).once('value', (upvoted)=>{
         if (upvoted.exists() && upvoted.val() === true) {
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:true, downvoted:false})
         }else if(upvoted.exists() && upvoted.val() === false) {
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:true})
         }else{
           this.data.unshift({key:snapshot.key, comment:snapshot.val().comment, createdAt:snapshot.val().createdAt,
              username:snapshot.val().username, userId:snapshot.val().userKey, user:snapshot.val().user,
              profilePicture:snapshot.val().profilePicture, votes:snapshot.val().votes,
            upvoted:false, downvoted:false})
         }
          this.setState({comments:this.data, refreshing:false, noComments:false, isLoading:false})
       })
    })
  }
  retrieveFollowers () {
    //Retrieve followers from firebase for notifications
    this.followersRef.once('value', (snapshots)=>{
      this.followers = []
      snapshots.forEach((snapshot)=>{
        this.followers.push({userId:snapshot.key})
        this.setState({followers:this.followers})
      })
    })
  }
  upvote (item, index) {
    //If the user has not previously upvoted the answer
    if (!item.upvoted) {
      //Set value for upvote to true for user
     this.upvoteRef.child(item.key).child(this.state.userId).set(true)
     //If the user had previously downvoted the answer, increase number of votes by 2
     if (item.downvoted && item.votes === -1) {
       item.votes = item.votes + 2
       //Update number of votes by 2
       this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 2)
       })
     }
     else {
       //If the user is just upvoting without previously downvoting
       //Update records by 1
       item.votes = item.votes + 1
       this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 1)
       })
     }
     //Update the UI to reflect changes in data
     item.upvoted = !item.upvoted
     item.downvoted = false
     var clone = this.state.comments
     clone[index] = item
     this.setState({comments:clone})
     //Send notification to user
     if (this.props.userId)
     Notifications.sendNotification(item.userId, 'upvote', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId'])
     else Notifications.sendNotification(item.userId, 'upvote_theory', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['courseId'])
    }
  }
  downvote (item, index) {
    //See upvote for comments
    if (!item.downvoted) {
      this.upvoteRef.child(item.key).child(this.state.userId).set(false)
      if (item.upvoted && item.votes === 1) {
        item.votes = item.votes - 2
        this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 2)
        })}
      else {
        item.votes = item.votes - 1
        this.commentsRef.child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 1)
        })
      }
      item.downvoted = !item.downvoted
      item.upvoted = false
      var clone = this.state.comments
      clone[index] = item
      this.setState({comments:clone})

      //Send notification to user
      if(this.props.userId)
      Notifications.sendNotification(item.userId, 'downvote', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId'])
      else Notifications.sendNotification(item.userId, 'downvote_theory', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId'])
    }
  }
  deleteComment () {
    var key = this.state.deleteKey
      this.upvoteRef.child(key).remove()
      this.commentsRef.child(key).remove()
      this.data = this.state.comments.filter((comment)=> { return comment.key !== key})
      this.setState({comments:this.data})
      if (this.props.userId) {
         this.exploreRef.child(this.state.collegeId).child(this.props.itemKey).child('comments').once('value', (comments) => {
           if (comments.exists()) comments.ref.set(comments.val() - 1)
           else comments.ref.set(0)
         })
      } else if (this.props.courseId) {
        this.questionsRef.child(this.props.item['userId']).child(this.props.itemKey).child('comments').once('value', (comments)=>{
          if (comments.exists()) comments.ref.set(comments.val() -  1)
          else comments.ref.set(0)
        })
      }
    this.handleRequestClose()
  }
  followQuestion () {
    //Check if question has been previously followed, if so remove it
    //Follow new questions
    if (this.state.following) {
      this.followersRef.child(this.state.userId).remove()
    }else {
        this.followersRef.child(this.state.userId).set(true)
    }
    this.setState(prevState =>({following:!prevState.following}))
  }
  shareComment () {
    if (this.state.text !== '') {
      var data = {
        userKey: this.state.userId,
        comment: this.state.comment,
        username:this.state.username,
        user:this.state.user,
        profilePicture: this.state.profilePicture,
        votes: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }
      this.commentsRef.push(data)
      this.setState({comment: ''})
      this.handleNotifications()
      //Send notifications to tagged followers
      this.sendTagNotification()
    }
   }
  sendTagNotification () {
     this.tagged = this.state.tagged.filter((user)=> { return this.state.comment.includes(user.username)})
      if (this.props.userId) {
        this.tagged.map((user)=> Notifications.sendNotification(user.userId, 'explore_mention', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId']))
      }else {
        this.tagged.map((user)=> Notifications.sendNotification(user.userId, 'theory_mention', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId']))
      }
   }
  handleNotifications () {
     if (this.props.userId) {
       this.state.followers.map((follower)=>{
         Notifications.sendNotification(follower.userId, 'explore_comment', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId'])
       })
        this.exploreRef.child(this.state.collegeId).child(this.props.itemKey).child('comments').once('value', (comments) => {
          if (comments.exists()) comments.ref.set(comments.val() + 1)
          else comments.ref.set(1)
        })
     } else {
       this.state.followers.map((follower)=>{
         Notifications.sendNotification(follower.userId, 'theory_comment', this.props.itemKey, this.props.item['post'], this.props.item['code'], this.props.item['userId'])
       })
       this.questionsRef.child(this.props.item['userId']).child(this.props.itemKey).child('comments').once('value', (comments)=>{
         if (comments.exists()) comments.ref.set(comments.val() + 1)
         else comments.ref.set(1)
       })
       this.statsRef.child(this.props.item['userId']).child(this.state.userId).child('total_comments').once('value', (snapshot)=>{
         if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
         else snapshot.ref.set(1)
       })
     }
   }
  formatTaggedComment (comment) {
    //Break from recursion if there are no more @ symbols in the text
    if (!comment.includes('@')) return (<span>{comment}</span>)
    //Split the comment into three halves Before @, @ to space, and After @
      var tempComment = comment
      var position = tempComment.indexOf('@')
      var before = comment.slice(0, position)
      tempComment = tempComment.slice(position)
      var end = tempComment.indexOf(' ')
      var name = tempComment.slice(0, end)
      var after = tempComment.slice(end)
      //Return a recursive call with the After...
     return (<span>{before} <span style={{color:'#2980b9'}}>{name}</span> {this.formatTaggedComment(after)}</span>)
  }
  replyTo (userId, username) {
    username = username.replace(' ', '_')
    if (userId !== this.state.currentUser){
      this.tagged.push({userId:userId, username:username})
      this.setState({comment:this.state.comment+' @'+username+' ', tagged:this.tagged, currentUser:userId})
    }else if (!this.state.comment.includes('@'+username)) {
        this.setState({comment:this.state.comment+' @'+username+' '})
    }
    this.textInput.focus()
  }
  handleSubmit = (event) => {
    event.preventDefault()
    this.shareComment()
  }
  render () {
    return (
        <div className="col-sm-8 col-sm-offset-2">
          <br/>
          <div style={{marginTop:60}}></div>
            <Paper zDepth={3}>
              <Panel>
                <div className="card">
                  <div className="card card-body">
                    <div className="row">
                      <div className="col-sm-12">
                          <div className='row'>
                            <div className='pull-right'>
                              <span className='pull-right' style={{marginRight:5}}>
                                {this.state.following ? <RaisedButton labelStyle={{color:'white'}}
                                  buttonStyle={{backgroundColor:'red', borderColor:'white'}}
                                  label="Unfollow" style={styles.button}
                                  onClick={()=>this.followQuestion()}
                                  labelPosition="before"
                                  icon={<NotificationsIcon style={{width:20, height:20}} />}
                                />:
                                <RaisedButton labelStyle={{color:'white'}}
                                  buttonStyle={{backgroundColor:'#2d6ca1', borderColor:'white'}}
                                  label="Follow" style={styles.button}
                                  onClick={()=>this.followQuestion()}
                                  labelPosition="before"
                                  icon={<NotificationsIcon style={{width:20, height:20}} />}
                                />}

                              </span>
                          </div>
                            {this.props.user ?
                              <div className='col-sm-2'>
                                <Avatar
                                  src={this.props.item['profilePicture']}
                                  size={60}
                                /><p className='lead'> {this.props.item['code']}</p>
                              </div>
                            :
                            <p className='lead'>{this.props.item['code']}</p>
                          }
                            <div className='col-sm-10'>
                              <p>{this.props.item['post']}</p>
                            </div>
                          </div>
                          {!this.props.noCreatedAt && <span className="pull-right">{timestamp.timeSince(this.props.item['createdAt'])}</span>}
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Paper>
            <div className='col-sm-12 col-xs-12'>
              {this.state.comments.map((comment, key)=>
                <div key={key} className="panel" style={{padding:10}} >
                  <div className="panel-default" style={{borderBottomWidth:0}}>
                    <div className="row">
                      <div className="col-sm-11">
                        <Avatar
                          src={comment.profilePicture}
                          size={45}
                        />
                      &nbsp;&nbsp;<Link to={"/social/"+comment.userId} style={{fontSize:14, fontWeight:'700',}} href='#'>
                      {comment.user}</Link>
                        &nbsp;&nbsp;<span className="fa fa-globe" style={{fontSize:12}}> {TimeStamp.timeSince(comment.createdAt)}</span>
                      </div>
                      <div className="col-sm-1 pull-right">
                        {this.state.userId === comment.userId && <IconButton ><Arrow onClick={(e)=>this.handleClickComment(e, comment.key)} /></IconButton>}
                        {this.state.userId !== comment.userId && <Reply  onClick={()=>this.replyTo(comment.userId, comment.username)} style={{color:'#2980b9', cursor:'pointer'}}></Reply>}
                     </div>
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className='row'>
                      <div className='col-sm-10 col-sm-offset-1'>
                        <p>{this.formatTaggedComment(comment.comment)}</p>
                        <div className='col-sm-6 col-sm-offset-3 col-xs-12'>
                          <div className='row'>
                            <div className='col-sm-4 col-xs-4'>
                              <IconButton iconStyle={{width:20, height:20, color:comment.upvoted ? blue300 : 'lightgrey'}}>
                                <ArrowUpward onClick={()=>this.upvote(comment, key)} />
                              </IconButton>
                            </div>
                            <div className='col-sm-4 col-xs-4'>
                              <p style={{padding:10}}>{comment.votes}</p>
                            </div>
                            <div className='col-sm-4 col-xs-4'>
                              <IconButton iconStyle={{width:20, height:20, color:comment.downvoted ? 'red' : 'lightgrey'}}>
                                <ArrowDownward  onClick={()=>this.downvote(comment, key)} />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Popover
               open={this.state.openComment}
               anchorEl={this.state.anchorComment}
               anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
               targetOrigin={{horizontal: 'left', vertical: 'top'}}
               onRequestClose={this.handleRequestClose}
               animation={PopoverAnimationVertical}
             >
               <Menu>
                 <MenuItem primaryText="Remove" onClick={()=>this.deleteComment()} />
               </Menu>
             </Popover>
            <div className='col-sm-10 col-sm-offset-1 col-xs-12' style={{position:'fixed', bottom:'0%', left:'0%'}}>
              <form>
                <div className='col-xs-10' style={{backgroundColor:'#EEE'}}>
                  <TextField
                    ref={(ref)=>this.textInput = ref}
                    hintText="Comment..."
                    fullWidth={true}
                    name='comment'
                    value={this.state.comment}
                    multiLine={true}
                    rowsMax={3}
                    hintStyle={{float:'right'}}
                    underlineStyle={styles.underlineStyle}
                    className='text-center'
                    underlineFocusStyle={styles.underlineStyle}
                    onChange = {this.handleTextChange}
                    inputStyle={{textAlign:'center', width:'100%' }}
                  />
                </div>
                <div className='col-xs-2'>
                  <IconButton onClick={this.handleSubmit} type='submit' iconStyle={{color:blue300 }}>
                    <Message   />
                  </IconButton>
                </div>
              </form>
            </div>
        </div>
      )
    }
  }
