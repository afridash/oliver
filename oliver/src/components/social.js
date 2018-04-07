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
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
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
const firebase = require('firebase')
export default class Social extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noActivity:false,
      user:{ userId:123,
        username:'imoris',
        displayName:'Richard Igbiriki',
        profilePicture:'',
        college:'Niger Delta University',
        completed:0,
        points:0,
        stars:0},
        followers:[1,2,3,4,5,6,7,8,9,10],
        posts:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        totalFollowers:20,
        current:0,
        counter:0,
    }
    this.usersRef = firebase.database().ref().child('users')
    this.statsRef = firebase.database().ref().child('user_stats')
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.increment = 9
    this.data = []
    this.posts = []
  }
  componentDidMount () {
    window.addEventListener("scroll", this.handleScroll)
    this.posts = this.state.posts
    for (var i=0; i<=this.increment; i++)
    this.data.push(this.posts[i])
    this.setState({posts:this.data, counter:this.data.length})
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
    if (user)
    this.getUser(user.uid)
  }
  async getUser (userId) {
    this.usersRef.child(userId).once('value', (user)=> {
      this.statsRef.child(userId).once('value', (stats)=> {
        var temp = {}
        if (stats.exists()){
          var stars = 0
          if (stats.val().points >= 1500) {
            stars = 5
          }else if (stats.val().points <= 1500) {
            stars = 4
          }else if (stats.val().points <= 600) {
            stars = 3
          }else if (stats.val().points <= 250) {
            stars = 2
          }else if (stats.val().points <= 100) {
            stars = 1
          }
          temp = {
            userId:user.key,
            displayName:user.val().displayName,
            profilePicture:user.val().profilePicture,
            college:user.val().college,
            username:user.val().username,
            completed:stats.val().completed,
            points:stats.val().points,
            stars:stars
          }
        }else{
          temp = {
            userId:user.key,
            displayName:user.val().displayName,
            profilePicture:user.val().profilePicture,
            college:user.val().college,
            username:user.val().username,
            completed:0,
            points:0,
            stars:0
          }
        }
        this.setState({user:temp})
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
  showPageContent () {
    const {user} = this.state
    return (
      <div className='col-sm-12'>
          <div className='col-sm-4' style={{backgroundColor:'#FAFAFA'}}>
            <div className='col-sm-12'>
              <Paper zDepth={2}>
                <form className='form-group'>
                  <textarea className='form-control' placeholder='Write something...' rows={5} style={{resize:'none'}} />
                  <div className='col-sm-12'>
                    <div className='col-xs-9'>
                    </div>
                    <div className='col-xs-3'>
                      <FlatButton primary={true} label='Share' style={{margin:5}} />
                    </div>
                  </div>
                </form>
              </Paper>
            </div>
            <div className="col-sm-12 col-xs-12">
            <Panel zDepth={2} rounded={true}>
            <div className="col-sm-12">
                <div className='row'>
                  <div className='col-sm-3 col-xs-12 text-center'>
                    <Avatar
                      src={user.profilePicture}
                      size={60}
                    />
                    <p>
                      {user.points === 0 && <StarHalf style={{width:20, height:20, color:blue300}} />}
                      {(()=>{
                          for(var i=0; i<user.stars; i++) return <Star style={{width:20, height:20, color:blue300}} />
                      })()
                      }
                    </p>
                  </div>
                  <div className='col-sm-9 col-xs-12' style={{borderLeft:'1px solid red'}}>
                    <p style={{fontSize:16, fontWeight:'600'}}>{user.displayName}</p>
                      <p style={{lineHeight:0.1, fontStyle:'italic'}}> @{user.username}</p>
                      <p>{user.college}</p>
                      <hr />
                      <p><span  style={{fontWeight:'600'}}>Sessions Completed: {user.completed}</span> &nbsp;&nbsp;&nbsp;<span  style={{fontWeight:'600'}}>Points: {user.points}</span></p>
                  </div>
                </div>
            </div>
          </Panel>
        </div>
        <div className='col-sm-12'>
          <div className='col-sm-12 text-center'>
            <h3 className='text-info lead'>Followers ({this.state.totalFollowers})</h3>
          </div>
          {this.state.followers.map((follower)=>
            <div className='col-sm-12' style={{marginTop:10}}>
              <Link className='col-sm-12 link' to='/social' style={{padding:15}}>
              <img src={user.profilePicture} style={{width:40, height:40}} className='img-circle' />
                &nbsp;&nbsp;<span>Richard Igbiriki</span>
              </Link>
            </div>
          )}
          <div className='col-sm-12 text-center'>
              <FlatButton primary={true} label='View All' style={{margin:5}} />
          </div>
        </div>
          </div>
          <div className='col-sm-8'>
            {this.state.noActivity ? this.noActivity() :
            this.state.posts.map((post)=>
              <Paper zDepth={2} style={style.paper} rounded={true}
                children={
                  <div className="row">
                    <br/>
                    <div className="col-sm-3">
                      <Avatar
                        src={user.profilePicture}
                        size={65}
                        className='img-responsive'
                      />
                      <h2 style={{fontSize:16}}>{user.username}</h2>
                    </div>
                    <div className='col-sm-9'>
                      <div className="col-sm-12">
                      <div className="col-sm-12">
                        <p className='pull-left' style={{fontSize:14, textAlign:'left'}}>Hello everyone! I am glad to have joined this platform. Hello everyone! I am glad to have joined this platform.Hello everyone! I am glad to have joined this platform </p>
                      </div>
                      <div className='col-sm-12' style={{height:'30'}}>
                        <div className='col-xs-6'>
                           <Fav onClick={()=>alert('Liked')} style={{cursor:'pointer', color:'black'}} ></Fav>
                          <span>2</span>
                        </div>
                        <div className='col-xs-6'>
                          <Link style={{textDecoration:'none'}} to={'/social/'}>
                            <Chat style={{cursor:'pointer'}}></Chat>
                          <span>3</span>
                          </Link>
                        </div>
                      </div>
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
