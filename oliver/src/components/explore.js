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
       noActivity:false
     };
       firebase.auth().onAuthStateChanged(this.handleUser)
       this.usersRef = firebase.database().ref().child('users')
       this.exploreRef = firebase.database().ref().child('explore')

   }
  handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
         this.getExplore (college.val())
       })
     }
   }
  async getExplore (collegeId) {
     await this.exploreRef.child(collegeId).once('value', (explores)=> {
       this.data = []
       if (!explores.exists()) this.setState({
         isloading:false,
         noActivity:true
       })
       //Loop through each question
       explores.forEach ((explore) => {
           this.data.push({key:explore.key, course:explore.val().course, courseCode:explore.val().courseCode, createdAt:explore.val().createdAt,
             message:explore.val().message,profilePicture:explore.val().profilePicture, percentage:explore.val().percentage, uid:explore.val().userId,
             username:explore.val().username, starCount:explore.val().starCount, courseId:explore.val().courseId})
             this.setState({explores:this.data,isloading:false})

       })
     })

   }
  select = (index) => this.setState({selectedIndex: index});
  spinner () {
     return (
       <div className='container'>
         <div className='col-md-2 col-md-offset-5'>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
         </div>
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
       {this.state.explores.map((explore)=>
         <div className="col-md-8 col-md-offset-2" >

           <Paper style={style.paper} zDepth={2} rounded={true}
             children={<div>
               <div className="row">
                 <br/>
                 <div className="col-md-6">
                   <Avatar
                     src={explore.profilePicture}
                     size={80}
                   />
                   <h2 style={{fontSize:25}}>{explore.username}</h2>

                 </div>
                 <div >

                     <h3 style={{fontSize:40, color:blue300}}> {explore.percentage}% </h3>
                   </div>

                     <div className="row">
                         <div className="col-sm-10 col-sm-offset-1">
                           <div className="well">
                             <p style={{fontSize:20}}> {explore.message}...I got {explore.percentage} % in {explore.course} {explore.courseCode} </p>
                           </div>
                         <div className="col-sm-8 col-sm-offset-2"><br />
                         <Link to={'/practice/'+ explore.courseId}>
                           <RaisedButton label="Start" fullWidth={true} style={style.chip}/>
                         </Link>
                         <br /> <br />
                         <Fav style={{cursor:'pointer', position:'absolute',left:0}}></Fav>
                         <Link to={'/explore/'+explore.key}>
                           <Chat  style={{cursor:'pointer', position:'absolute',right:0}}></Chat>
                         </Link>

                           <br />    <br />
                           {timestamp.timeSince(explore.createdAt)}
                         </div>
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
        this.state.redirect ? <Redirect to='/' push/> : <MuiThemeProvider muiTheme={muiTheme} >
      <div className="center">
        <div className="row">
          <br/>
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
