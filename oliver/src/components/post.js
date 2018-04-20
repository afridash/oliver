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
export default class Post extends Component {
  constructor (props) {
    super (props)
    this.state = {
      comments: [],
      tagged: [],
      index: 0,
      userId:'',
      username:'',
      user:'',
      name:'Richard Igbiriki',
      comment:'',
      following:false
    }
    this.postId = this.props.match.params.id
    this.commentsRef = firebase.database().ref().child('post_comments')
    this.postsRef = firebase.database().ref().child('posts')
    this.likesRef = firebase.database().ref().child('comment_likes')
    this.usersRef = firebase.database().ref().child('users')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.data = []
    this.tagged = []
  }
  componentWillMount () {
    this.postsRef.child(this.postId).once('value', (post)=> {
      this.setState({
        post:post.val().post,
        postPicture:post.val().profilePicture,
        postUserId:post.val().userId,
        postDisplayName:post.val().displayName,
        postCreatedAt:post.val().createdAt,
      })
    })
  }
  handleUser = async (user) => {
    if (user) {
      this.usersRef.child(user.uid).child('username').once('value', async (username)=> {
        await this.setState({userId:user.uid, user:user.displayName, username:username.val(), profilePicture:user.photoURL})
        this.retrieveComments()
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
     this.commentsRef.child(this.postId).on('child_added', (snapshot)=>{
       this.likesRef.child(snapshot.key).child(this.state.userId).once('value', (upvoted)=>{
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
  upvote (item, index) {
    //If the user has not previously upvoted the answer
    if (!item.upvoted) {
      //Set value for upvote to true for user
     this.likesRef.child(item.key).child(this.state.userId).set(true)
     //If the user had previously downvoted the answer, increase number of votes by 2
     if (item.downvoted && item.votes === -1) {
       item.votes = item.votes + 2
       //Update number of votes by 2
       this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
         votes.ref.set(votes.val() + 2)
       })
     }
     else {
       //If the user is just upvoting without previously downvoting
       //Update records by 1
       item.votes = item.votes + 1
       this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
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
     Notifications.sendUserNotification(item.userId, 'comment_like', this.postId)
    }
  }
  downvote (item, index) {
    //See upvote for comments
    if (!item.downvoted) {
      this.likesRef.child(item.key).child(this.state.userId).set(false)
      if (item.upvoted && item.votes === 1) {
        item.votes = item.votes - 2
        this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 2)
        })}
      else {
        item.votes = item.votes - 1
        this.commentsRef.child(this.postId).child(item.key).child('votes').once('value', (votes)=>{
          votes.ref.set(votes.val() - 1)
        })
      }
      item.downvoted = !item.downvoted
      item.upvoted = false
      var clone = this.state.comments
      clone[index] = item
      this.setState({comments:clone})
    }
  }
  deleteComment () {
    var key = this.state.deleteKey
      this.likesRef.child(key).remove()
      this.commentsRef.child(this.postId).child(key).remove()
      this.data = this.state.comments.filter((comment)=> { return comment.key !== key})
      this.setState({comments:this.data})
       this.postsRef.child(this.postId).child('comments').once('value', (comments) => {
         if (comments.exists()) comments.ref.set(comments.val() - 1)
         else comments.ref.set(0)
       })
       this.handleRequestClose()
  }
  shareComment () {
    if (this.state.comment !== '') {
      var data = {
        userKey: this.state.userId,
        comment: this.state.comment,
        username:this.state.username,
        user:this.state.user,
        profilePicture: this.state.profilePicture,
        votes: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }
      this.commentsRef.child(this.postId).push(data)
      this.setState({comment: ''})
      this.handleNotifications()
      //Send notifications to tagged followers
      this.sendTagNotification()
    }
   }
  sendTagNotification () {
     this.tagged = this.state.tagged.filter((user)=> { return this.state.comment.includes(user.username)})
      this.tagged.map((user)=> Notifications.sendUserNotification(user.userId, 'comment_mention', this.postId))
   }
  handleNotifications () {
    Notifications.sendUserNotification(this.state.postUserId, 'comment', this.postId)
    this.postsRef.child(this.postId).child('comments').once('value', (comments) => {
      if (comments.exists()) comments.ref.set(comments.val() + 1)
      else comments.ref.set(1)
    })
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
                              <div className='col-sm-3 text-center'>
                                <Avatar
                                  src={this.state.postPicture}
                                  size={65}
                                /><p className='lead'> {this.state.postDisplayName}</p>
                              </div>
                            <div className='col-sm-9'>
                              <p>{this.state.post}</p>
                            </div>
                          </div>
                          <span className="pull-right">
                            {
                              timestamp.timeSince(this.state.postCreatedAt)
                          }
                        </span>
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
