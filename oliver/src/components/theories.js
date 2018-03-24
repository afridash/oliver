import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import {Firebase} from '../auth/firebase'
import {Redirect, Link} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress';
const firebase = require('firebase')


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
const style = {
  chip: {
    margin: 4,
    backgroundColor:'#cfecf7',
  },
  paper:{
    textAlign: 'center',
    margin: 20,

  },
  height:50,
  textAlign: 'center',
};
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
 export default class Theories extends Component {
  constructor(props) {
     super(props);
     this.state = {
       data:[],
       questions:[],
       isloading:true,
       noActivity:false,
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
     await this.questionsRef.orderByChild('type').equalTo('theory').once('value', (questions)=> {
         this.data = []
       //If questions are not found under courseId, course does not exist
       //console.log(questions)
       if (!questions.exists()) {
         this.setState({
           noActivity:true,
           isloading:false
         })
       }
       //Loop through each question
       questions.forEach ((question) => {
         //If answered, add to questions array, and update state of questions
           this.data.push({key:question.key, answer:question.val().answer,question:
             question.val().question, selected:''})
             this.setState({questions:this.data, isloading:false})
       })
     })
   }
  select = (index) => this.setState({selectedIndex: index});
  spinner () {
     return (
       <div className='row text-center'>
         <div className='col-md-6 col-md-offset-3'>
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
           <p className='text-info lead'>No Theories...</p>
           <Link to={"/AppHome"}>
             <RaisedButton label="Return Home" primary={true} fullWidth={true} style={style.chip}/>
           </Link>
         </div>
         </div>
     )
   }
  showPageContent () {
     return (
       <div className="container">
          <div className="row">
            <div >
                {this.state.questions.map((question)=>
                  <Link to={'/theory/'+this.courseId +'/'+question.key}>
                    <Paper  zDepth={2}
                      children={<div className='col-sm-offset-1 col-sm-10'>
                     <div className="panel panel-default">
                       <div className="panel-heading">
                      <p style={{ fontSize:20}}> {question.question}</p>
                       </div>
                       <div className="panel-body">
                         <div style={{fontSize:20}} >
                           <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}>
                             <p style={{fontSize:20}}> &nbsp;&nbsp;{question.answer}</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 }/>
              </Link>
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
