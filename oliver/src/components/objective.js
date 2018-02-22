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
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

function handleClick() {
  alert('You clicked the Chip.');
}

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    );
  }
}

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';

 const muiTheme = getMuiTheme({
   palette: {
     textColor: '#424242',
   },
   appBar: {
     height: 50,
     color:'#2d6ca1',
   },
 })
 class Objective extends Component {
   constructor(props) {
     super(props);
     this.state = {
       data:[],
       questions:[],
       isloading:true,
       noActivity:false
     };
     this.courseId = this.props.match.params.id
       this.usersRef = firebase.database().ref().child('users')
       this.courseRef = firebase.database().ref().child('user_courses')
       this.questionsRef = firebase.database().ref().child('questions').child(this.courseId)
       firebase.auth().onAuthStateChanged(this.handleUser)

   }
   handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
         this.getQuestions (college.val())
       })
     }
   }
   componentWillMount () {
     this.getQuestions()
   }
   async getQuestions () {
     //Get questions from questions db using courseId
     await this.questionsRef.orderByChild('type').equalTo('objective').once('value', (questions)=> {
         this.data = []
      // console.log(questions.val())
       //If questions are not found under courseId, course does not exist
       if (!questions.exists()) {
         this.setState({isloading:false, noActivity:true})
       }

       questions.forEach((question)=>{
          if (question.val().answered) {
            var answer = ''
            if (question.val().answer.toLowerCase() === 'a') answer = question.val().optionA
            if (question.val().answer.toLowerCase() === 'b') answer = question.val().optionB
            if (question.val().answer.toLowerCase() === 'c') answer = question.val().optionC
            if (question.val().answer.toLowerCase() === 'd') answer = question.val().optionD

            this.data.push({key:question.key, answer:answer,question:
              question.val().question})
            this.setState({questions:this.data,isloading:false})
          }

       })
     })
   }

 handleLogout (event) {
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
      // An error happened.
    });
      this.setState({redirect:true})
    }


   select = (index) => this.setState({selectedIndex: index});

   spinner () {
     return (
       <div className='container'>
         <div className='col-md-2 col-md-offset-5'>
           <br />  <br />   <br />  <br />    <br />  <br />
           <CircularProgress size={60} thickness={7} />
         </div>
       </div>
     )
   }

   noActivity () {
     return (
       <p>No Activity</p>
     )
   }

   showPageContent () {
     return(
       <div className="container">

          <div className="row">

            <div >
                {this.state.questions.map((question)=>
              <Paper  zDepth={2}
                children={<div>
               <div className="panel panel-default">

                 <div className="panel-heading">
                <p style={{ fontSize:20}}> {question.question}</p>
                 </div>
                 <div className="panel-body">
                   <div style={{fontSize:20}} >
                     <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>{question.answer}</p></div>


                   </div>
                 </div>
               </div>
             </div>
           }/>
             )}

            </div>
          </div>

        </div>
     )
   }
  render() {


    return (
        this.state.redirect ? <Redirect to='/' push/> : <MuiThemeProvider muiTheme={muiTheme} >
      <div>

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
       </MuiThemeProvider>
    );
  }
}

export default Objective;
