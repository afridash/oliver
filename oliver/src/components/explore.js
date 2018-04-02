import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import SearchBar from 'material-ui-search-bar';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Restore from 'material-ui/svg-icons/action/restore';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import List from 'material-ui/List/List';
import Divider from 'material-ui/Divider';
import Fav from 'material-ui/svg-icons/action/favorite-border';
import Chat from 'material-ui/svg-icons/communication/chat-bubble-outline';
import {Firebase} from '../auth/firebase'
import {Redirect, Link} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress';
import * as Notifications from '../auth/notifications'
import * as timestamp from '../auth/timestamp'
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const styles = {
  radioButton: {
    marginTop: 16,
  },
};

const style = {
  chip: {
    margin: 4,
    backgroundColor:'#cfecf7',
    //width:'100%'
  },
  paper:{
    textAlign: 'center',
    margin: 20,

  },
    height:50,
    textAlign: 'center',
};
const iconStyles = {
  marginRight: 24,
}
 const muiTheme = getMuiTheme({
   palette: {
     textColor: '#424242',
   },
   appBar: {
     height: 50,
     color:'#2d6ca1',
   },
 })
 export default class Explore extends Component {
  constructor(props) {
     super(props);
     this.state = {
       data:[],
       explores:[],
       isloading:true,
       noActivity:false,
       next:false,
       current:0,
       counter:0,
     };
       firebase.auth().onAuthStateChanged(this.handleUser)
       this.usersRef = firebase.database().ref().child('users')
       this.exploreRef = firebase.database().ref().child('explore')
       this.likesRef = firebase.database().ref('explore_likes')
       this.handleScroll = this.handleScroll.bind(this);
       this.increment = 5
       this.data = []
       this.explores = []
   }
  componentDidMount () {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount  () {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll() {
   const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
   const body = document.body;
   const html = document.documentElement;
   const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
   const windowBottom = windowHeight + window.pageYOffset;
   if (windowBottom >= docHeight) {
     this.showNextSet()
   }
 }
 onRowPress(key, post){
   if (post.postLike) {
     this.unlikePost(post.key)
     post.starCount = post.starCount - 1
   } else {
     this.likePost(post.key, post)
     post.starCount = post.starCount + 1
   }
   post.postLike = !post.postLike
   var clone = this.state.explores
   clone[key] = post
   this.setState({explores:clone})
 }
 likePost (postId, post) {
  this.likesRef.child(postId).child(this.state.userId).set(true)
    this.exploreRef.child(this.state.collegeId).child(postId).child('starCount').once('value', (likesCount)=>{
     likesCount.ref.set(likesCount.val() + 1)
   })
   Notifications.sendNotification(post.userId, 'explore_like', postId, post.message + " " + post.percentage + "% in "+ post.title + "("+post.code+")", post.username)
 }
 unlikePost (postId) {
   this.likesRef.child(postId).child(this.state.userId).remove()
   this.exploreRef.child(this.state.collegeId).child(postId).child('starCount').once('value', (likesCount)=>{
      likesCount.ref.set(likesCount.val() - 1)
   })
 }
  handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
         this.setState({collegeId:college.val()})
         this.getExplore (college.val())
       })
     }
   }
  async getExplore (collegeId) {
     await this.exploreRef.child(collegeId).limitToFirst(200).once('value', async (explores)=> {

       if (!explores.exists()) this.setState({
         isloading:false,
         noActivity:true
       })
       //Loop through each question
       explores.forEach ((explore) => {
         this.likesRef.child(explore.key).child(this.state.userId).once('value', (likeVal)=>{
           if (likeVal.exists()) {
             this.explores.push({key:explore.key, course:explore.val().course, courseCode:explore.val().courseCode, createdAt:explore.val().createdAt,
               message:explore.val().message,profilePicture:explore.val().profilePicture, percentage:explore.val().percentage, userId:explore.val().userId,
               username:explore.val().username, starCount:explore.val().starCount, courseId:explore.val().courseId, postLike:true, comments:explore.hasChild('comments') ? explore.val().comments : 0})
           }else {
             this.explores.push({key:explore.key, course:explore.val().course, courseCode:explore.val().courseCode, createdAt:explore.val().createdAt,
               message:explore.val().message,profilePicture:explore.val().profilePicture, percentage:explore.val().percentage, userId:explore.val().userId,
               username:explore.val().username, starCount:explore.val().starCount, courseId:explore.val().courseId, postLike:false, comments:explore.hasChild('comments') ? explore.val().comments : 0})
           }
           this.explores.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
           this.showFirstSet(this.explores.length, this.explores)
         })
       })
     })

   }
  select = (index) => this.setState({selectedIndex: index});
  showFirstSet (length, el) {
    if (length < this.increment) {
      var data= []
      for (var i=0; i<length; i++){
        data.push(this.explores[i])
        this.setState({explores:data, isloading:false})
      }
    }
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.explores[i])
       this.setState({explores:this.data, isloading:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
    if (this.state.counter + this.increment > this.explores.length-1){
      await this.setState({current:this.state.counter, counter:this.explores.length-1, next:false,})
    }else {
        await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
    }
    await this.getNextSet()
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
           <p className='text-info lead'>No explorers on your campus...</p>
           <Link to={"/AppHome"}>
             <RaisedButton label="Return Home" secondary={true} fullWidth={true} style={style.chip}/>
           </Link>
         </div>
         </div>
     )
   }
  showPageContent () {
     return (
     <div className="row">
       {this.state.explores.map((explore, key)=>
         <div className="col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2" >
           <Paper style={style.paper} zDepth={2} rounded={true}
             children={<div>
               <div className="row">
                 <br/>
                 <div className="col-sm-3">
                   <Avatar
                     src={explore.profilePicture}
                     size={80}
                   />
                   <h2 style={{fontSize:20}}>{explore.username}</h2>
                 </div>
                 <div className='col-sm-9' >
                   <div className="col-sm-12">
                   <div className="well">
                     <p style={{fontSize:14}}> {explore.message}...I got {explore.percentage} % in {explore.course} {explore.courseCode} </p>
                   </div>
                   <div className='col-sm-12'>
                     <div className='col-sm-3'>
                        <Fav onClick={()=>this.onRowPress(key, explore)} style={{cursor:'pointer', color: explore.postLike ? 'red' : 'black'}} ></Fav>
                        {explore.starCount !== 0 && <span>{explore.starCount}</span>}
                     </div>
                     <div className='col-sm-3'>
                       <Link style={{textDecoration:'none'}} to={'/explore/'+explore.key}>
                         <Chat style={{cursor:'pointer'}}></Chat>
                         {explore.comments !== 0 && <span>{explore.comments}</span>}
                       </Link>
                     </div>
                     <div className='col-sm-6'>
                       <Link style={{textDecoration:'none'}} to={'/practice/'+ explore.courseId}>
                         <p>START</p>
                       </Link>
                     </div>
                   </div>
                   </div>
                   </div>
                     <div className="col-sm-12">
                         <div className="col-sm-10 col-sm-offset-1">
                           <br/><br/>
                           {timestamp.timeSince(explore.createdAt)}
                         </div>
                     </div>

               </div>
             </div> }/>
         </div>
               )}
       </div>
        )
   }
  render() {
    var styles = {
      appBar: {
        flexWrap: 'wrap'
      },
      tabs: {
        width: '100%'
      }
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div className="center">
        <div className="row">
          <br/>
          <div style={{marginTop:60}}></div>
          {
            (()=>{
            if (this.state.isloading){
              return this.spinner()
            }
            else if (this.state.noActivity) {
              return this.noActivity()
            }
            else {
              return this.showPageContent()
            }
          })()
        }
        </div>
      </div>
       </MuiThemeProvider>
    );
  }
}
