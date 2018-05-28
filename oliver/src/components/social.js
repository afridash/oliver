import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import {Firebase} from '../auth/firebase'
import StarHalf from 'material-ui/svg-icons/toggle/star-half'
import Fav from 'material-ui/svg-icons/action/favorite-border'
import Chat from 'material-ui/svg-icons/communication/chat-bubble-outline'
import {Panel} from 'react-bootstrap'
import Star from 'material-ui/svg-icons/toggle/star'
import * as Notifications from '../auth/notifications'
import Person from 'material-ui/svg-icons/social/person-add'
import Arrow from 'material-ui/svg-icons/navigation/expand-more'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {
  blue300,
} from 'material-ui/styles/colors';
const style = {
  paper:{
    textAlign: 'center',
    margin: 20,

  },
    height:50,
    textAlign: 'center',
};
const styles = {
  button:{
    float:'right',
    margin:5
  },
}
const firebase = require('firebase')
export default class Social extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noActivity:false,
      user:{followers:0},
      followers:[],
      posts:[],
      totalFollowers:20,
      current:0,
      counter:0,
      post:'',
    }
    this.userId = this.props.match.params.id
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    this.followersRef = firebase.database().ref().child('followers')
    this.followingRef = firebase.database().ref().child('following')
    this.postsRef = firebase.database().ref().child('posts')
    this.userPostsRef = firebase.database().ref().child('user_posts')
    this.likesRef = firebase.database().ref().child('post_likes')
    this.notificationsRef = firebase.database().ref('notifications')
    this.badgesRef = firebase.database().ref().child('badges')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.increment = 9
    this.data = []
    this.posts = []
    this.followers = []
  }
  componentDidMount () {
    window.addEventListener("scroll", this.handleScroll)
  }
  componentWillUnmount  () {
    window.removeEventListener("scroll", this.handleScroll)
  }
  handleScroll = () => {
   const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight
   const body = document.body
   const html = document.documentElement
   const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight)
   const windowBottom = windowHeight + window.pageYOffset
   if (windowBottom >= docHeight) {
     this.showNextSet()
   }
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.posts[i])
       this.setState({posts:this.data, loading:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
    if (this.state.counter + this.increment > this.posts.length-1){
      await this.setState({current:this.state.counter, counter:this.posts.length-1, next:false,})
    }else {
        await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
    }
    await this.getNextSet()
  }
  handleUser = (user) => {
    if (user) {
      if (this.userId !== undefined) {
        this.getUser(this.userId)
        this.retrieveFollowers(this.userId)
        this.retrievePosts(this.userId)
        this.setState({postAvailable:false})
      }else{
        this.getUser(user.uid)
        this.retrieveFollowers(user.uid)
        this.retrievePosts(user.uid)
        this.setState({postAvailable:true})
      }
      this.setState({userId:user.uid, displayName:user.displayName, profilePicture:user.photoURL})
      }
  }
  handleChange = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }
  handleSubmit = (event) => {
    event.preventDefault()
    if (this.state.post !== '') {
      var data = {
        userId:this.state.userId,
        displayName:this.state.displayName,
        profilePicture:this.state.profilePicture,
        post:this.state.post,
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        comments:0,
        starCount:0,
      }
      var postKey = this.postsRef.push(data).key
      var item = this.userPostsRef.child(this.state.userId).push()
      var key = item.key
      item.setWithPriority(postKey, 0 - Date.now())
      data['postKey'] = postKey
      data['key'] = key
      this.posts.unshift(data)
      this.data.unshift(data)
      this.state.followers.forEach((follower)=> {
        item = this.userPostsRef.child(follower.userId).push()
        item.setWithPriority(postKey, 0 - Date.now())
      })
      this.setState({post:'', posts:this.data, noActivity:false})
    }
  }
  handleClickComment (event, post) {
    this.setState({
      openComment: true,
      anchorComment: event.currentTarget,
      deleteKey: post.key,
      postUserId:post.userId,
      postId:post.postKey
    })
  }
  handleRequestClose = () => {
   this.setState({
     open: false,
     openComment:false,
   })
  }
  async getUser (userId) {
    this.usersRef.child(userId).once('value', (user)=> {
      this.listUser(user)
    })
  }
  async listUser (user) {
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
          followers:user.val().followers ? user.val().followers : 0,
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
          followers:user.val().followers ? user.val().followers : 0,
          stars:stars,
          following:false
        }
      }
        this.setState({user:temp})
    })
  }
  retrieveFollowers (userId) {
    this.followersRef.child(userId).limitToFirst(10).once('value', (followers)=> {
      followers.forEach((follower)=> {
        this.usersRef.child(follower.key).once('value', (user)=>{
          this.followers.push({displayName:user.val().displayName, profilePicture:user.val().profilePicture, userId:user.key})
          this.setState({followers:this.followers})
        })
      })
    })
  }
  retrievePosts (userId) {
    this.userPostsRef.child(userId).limitToFirst(200).once('value', (posts)=> {
      var count = 0
      if (!posts.exists()) this.setState({loading:false, noActivity:true})
      else {
        count = Object.keys(posts.val()).length
      }
      var index = 0
      posts.forEach((post)=> {
        this.postsRef.child(post.val()).once('value', (p)=> {
          if (p.exists()){
            this.likesRef.child(post.val()).child(this.state.userId).once('value', (likeVal)=> {
              if (likeVal.exists()) {
                this.posts.push({
                  postKey:post.val(),
                  key:post.key,
                  userId:p.val().userId,
                  displayName:p.val().displayName,
                  profilePicture:p.val().profilePicture,
                  post:p.val().post,
                  createdAt:p.val().createdAt,
                  comments:p.val().comments,
                  starCount:p.val().starCount,
                  postLike:true,
                })
              }else{
                this.posts.push({
                  postKey:post.val(),
                  key:post.key,
                  userId:p.val().userId,
                  displayName:p.val().displayName,
                  profilePicture:p.val().profilePicture,
                  post:p.val().post,
                  createdAt:p.val().createdAt,
                  comments:p.val().comments,
                  starCount:p.val().starCount,
                  postLike:false
                })
              }
              index++
              if (index === count) {
                this.showNextSet()
              }
            })
          }else{
            count--
          }
        })
      })
    })
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
          <p className='text-info lead'>No Posts</p>
        </div>
        </div>
    )
  }
  printStars (user) {
      var items = []
      for (var i=0; i<user.stars; i++) {
         items.push(<Star style={{width:20, height:20, color:blue300}} />)
      }
      return items
    }
  onRowPress(key, post){
    if (post.postLike) {
        this.unlikePost(post.postKey)
        post.starCount = post.starCount - 1
      } else {
        this.likePost(post.postKey, post)
        post.starCount = post.starCount + 1
      }
      post.postLike = !post.postLike
      var clone = this.state.posts
      clone[key] = post
      this.setState({posts:clone})
  }
  likePost (postId, post) {
     this.likesRef.child(postId).child(this.state.userId).set(true)
       this.postsRef.child(postId).child('starCount').once('value', (likesCount)=>{
        likesCount.ref.set(likesCount.val() + 1)
      })
    Notifications.sendUserNotification(post.userId, 'like', postId)
  }
  unlikePost (postId) {
    this.likesRef.child(postId).child(this.state.userId).remove()
    this.exploreRef.child(postId).child('starCount').once('value', (likesCount)=>{
        likesCount.ref.set(likesCount.val() - 1)
    })
  }
  deletePost () {
    this.data = []
    if (this.state.userId === this.state.postUserId) {
      this.userPostsRef.child(this.state.userId).child(this.state.deleteKey).remove()
      this.postsRef.child(this.state.postId).remove()
      this.filterPosts()
    }else{
      this.userPostsRef.child(this.state.userId).child(this.state.deleteKey).remove()
      this.filterPosts()
    }
    this.handleRequestClose()
  }
  async filterPosts () {
    this.posts = this.posts.filter((post)=> post.key !== this.state.deleteKey)
    await this.setState({counter:0,current:0})
    this.showNextSet()
  }
  followUser (user) {
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
        var postData = {
          userId: this.state.userId,
          profilePicture: this.state.profilePicture,
          displayName: this.state.displayName,
          type: 'follow',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }
        var item = this.notificationsRef.child(user.userId).push()
        item.setWithPriority(postData, 0 - Date.now())
        //Update badges
        this.badgesRef.child(user.userId).child('notificationsBadges').once('value', (badgeCount)=>{
          if (badgeCount.val()) badgeCount.ref.set(badgeCount.val() + 1)
          else badgeCount.ref.set(1)
        })
    }
    //Update the UI
    user.following = !user.following
    this.setState({users:user})
  }
  checkMessageLength (message) {
    return message.length > 350
  }
  showPageContent () {
    const {user} = this.state
    return (
      <div className='col-sm-12'>
          <div className='col-sm-4' style={{backgroundColor:'#FAFAFA'}}>
            {this.state.postAvailable && <div className='col-sm-12'>
              <Paper zDepth={2}>
                <form className='form-group'>
                  <textarea value={this.state.post} className='form-control' onChange={this.handleChange} placeholder='Write something...' rows={5} style={{resize:'none'}} name='post' />
                  <div className='col-sm-12'>
                    <div className='col-sm-9'>
                    </div>
                    <div className='col-sm-3'>
                      <FlatButton type='submit' onClick={this.handleSubmit} primary={true} label='Share' style={{margin:5}} />
                    </div>
                  </div>
                </form>
              </Paper>
            </div>}
            <div className="col-sm-12">
            <Panel>
            <div className="col-sm-12">
                <div className='row'>
                  <div className='col-sm-12 text-center'>
                    <Avatar
                      src={user.profilePicture}
                      size={60}
                    />
                    <p>
                      {user.points === 0 && <StarHalf style={{width:20, height:20, color:blue300}} />}
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
                      <Link style={{textDecoration:'none'}} to={'/profile/'+user.userId}><p style={{fontSize:16, fontWeight:'600'}}>{user.displayName}</p></Link>
                      <p style={{lineHeight:0.1, fontStyle:'italic'}}> @{user.username}</p>
                      <p>{user.college}</p>
                      <hr />
                      <p><span  style={{fontWeight:'600'}}>Sessions Completed: {user.completed}</span> &nbsp;&nbsp;&nbsp;<span  style={{fontWeight:'600'}}>Points: {user.points}</span></p>
                  </div>
                  <div className='col-sm-12 text-center hidden-lg hidden-md hidden-sm'>
                    <Link to={!this.state.postAvailable ? '/followers/'+this.userId : '/followers'}>
                      <FlatButton primary={true} label={'Followers (' + user.followers + ' )'} style={{margin:5}} />
                    </Link>
                  </div>
                </div>
            </div>
          </Panel>
        </div>
        <div className='col-sm-12 hidden-xs'>
          <div className='col-sm-12 text-center '>
            <h3 className='text-info lead'>Followers ({user.followers})</h3>
          </div>
          {this.state.followers.map((follower, key)=>
            <div key={key} className='col-sm-12' style={{marginTop:10}}>
              <Link className='col-sm-12 link' to={'/social/'+follower.userId} style={{padding:15}}>
              <img src={follower.profilePicture} style={{width:40, height:40}} className='img-circle' />
                &nbsp;&nbsp;<span>{follower.displayName}</span>
              </Link>
            </div>
          )}
          <div className='col-sm-12 text-center'>
            <Link to={!this.state.postAvailable ? '/followers/'+this.userId : '/followers'}>
              <FlatButton primary={true} label='View All' style={{margin:5}} />
            </Link>
          </div>
        </div>
          </div>
          <div className='col-sm-8'>
            {this.state.noActivity ? this.noActivity() :
            this.state.posts.map((post, key)=>
              <Paper zDepth={2} style={style.paper} rounded={true}
                children={
                  <div className="row">
                    <br/>
                    <div className="col-sm-3">
                      <Avatar
                        src={post.profilePicture}
                        size={65}
                        className='img-responsive'
                      />
                      <h2 style={{fontSize:16}}>{post.displayName}</h2>
                    </div>
                    <div className='col-sm-9'>
                      <div className="col-sm-12">
                       <div className="col-sm-12">
                         <span className="pull-right">
                          <IconButton ><Arrow onClick={(e)=>this.handleClickComment(e, post)} /></IconButton>
                         </span>
                         {this.checkMessageLength(post.post) ?
                           <p className='pull-left' style={{fontSize:14, textAlign:'left'}}>{post.post.substr(0, 350)} <Link style={{textDecoration:'none'}} to={'/post/'+post.postKey}>...Show More</Link></p> :
                           <p className='pull-left' style={{fontSize:14, textAlign:'left'}}>{post.post}</p> }
                       </div>
                       <div className='col-sm-12' style={{height:'30'}}>
                         <div className='col-xs-6'>
                           <Fav onClick={()=>this.onRowPress(key, post)} style={{cursor:'pointer', color:post.postLike ? 'red' : 'black'}} ></Fav>
                           {post.starCount !== 0 && <span>{post.starCount}</span>}
                         </div>
                         <div className='col-xs-6'>
                          <Link style={{textDecoration:'none'}} to={'/post/'+post.postKey}>
                            <Chat style={{cursor:'pointer'}}></Chat>
                            {post.comments !== 0 && <span>{post.comments}</span>}
                          </Link>
                        </div>
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
                           <MenuItem primaryText="Remove" onClick={()=>this.deletePost()} />
                         </Menu>
                       </Popover>
                      </div>
                      </div>
                  </div> }
                />
            )}
          </div>
      </div>
    )
  }
  render () {
    return (
      <div className='row'>
        <div style={{marginTop:80}}></div>
        {(()=>{
          if (this.state.loading)
          return this.spinner()
          else return this.showPageContent()
        })()}
      </div>
    )
  }
}
