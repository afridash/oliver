import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
import {Firebase} from '../auth/firebase'
import {Link} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'
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
       prev:false,
       next:false,
       current:0,
       counter:0,
     };
     this.courseId = this.props.match.params.id
     this.usersRef = firebase.database().ref().child('users')
     this.courseRef = firebase.database().ref().child('user_courses')
     this.questionsRef = firebase.database().ref().child('questions').child(this.courseId)
     firebase.auth().onAuthStateChanged(this.handleUser)
     this.increment = 14
     this.data = []
   }
  handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
     }
   }
  componentWillMount () {
     this.getQuestions()
   }
  async getQuestions () {
     //Get questions from questions db using courseId
     await this.questionsRef.orderByChild('type').equalTo('theory').once('value', (questions)=> {
         this.questions = []
       //If questions are not found under courseId, course does not exist
       //console.log(questions)
       if (!questions.exists()) {
         this.setState({
           noActivity:true,
           isloading:false
         })
       }
       var id = 1
       //Loop through each question
       questions.forEach ((question) => {
           this.questions.push({key:question.key,
             answer:question.val().answer,
             question:question.val().question,
             comments:question.hasChild('comments') ? question.val().comments : 0,
             selected:'',
             id:id++})
       })
     })
     await  this.questions.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
     this.showNextSet()
   }
  async getNextSet () {
    for (var i=this.state.current; i<=this.state.counter; i++){
      this.data.push(this.questions[i])
      this.setState({questions:this.data, isloading:false})
    }
    await this.setState({counter:this.state.counter + 1})
  }
  async showNextSet () {
    if (this.state.counter + this.increment > this.questions.length-1){
      await this.setState({current:this.state.counter, counter:this.questions.length-1, next:false,})
    }else {
        await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
    }
    if (this.state.current >= this.increment ) this.setState({prev:true})

    await this.getNextSet()
  }
  async showPrevSet () {
    await this.setState({counter:this.state.current-1, current:this.state.current-this.increment-1,  next:true})
    if (this.state.current <= 0 )this.setState({prev:false})
     this.getNextSet()
    }
  select = (index) => this.setState({selectedIndex: index});
  spinner () {
     return (
       <div className='row text-center'>
         <div style={{marginTop:60}}></div>
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
         <div style={{marginTop:60}}></div>
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
            <div style={{marginTop:60}} >
              <div className='text-center text-info'>
                <p className='lead'>Showing {this.state.current + 1} to {this.state.counter } of {this.questions.length}</p>
              </div>
                {this.state.questions.map((question)=>
                  <Link to={'/theory/'+this.courseId +'/'+question.key}>
                    <Paper  zDepth={2}
                      children={<div className='col-sm-offset-1 col-sm-10'>
                     <div className="panel panel-default">
                       <div className="panel-heading">
                      <p style={{ fontSize:20}}>{question.id}. &nbsp; {question.question}</p>
                       </div>
                       <div className="panel-body">
                         <div style={{fontSize:20}} >
                           <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}>
                             <p style={{fontSize:20}}> &nbsp;&nbsp;{question.answer}</p>
                           </div>
                           {question.comments !== 0 && <p style={{fontSize:12, fontWeight:'600'}}>Replies: {question.comments}</p>}
                         </div>
                       </div>
                     </div>
                   </div>
                 }/>
              </Link>
             )}
             <div className='col-sm-12 text-center'>
               {this.state.next && <RaisedButton className='text-center' label="Show More" primary={true} style={style.chip} onClick={()=>{this.showNextSet()}}/>}
             </div>
            </div>
          </div>
        </div>
     )
   }
  render() {
    return (
    <MuiThemeProvider muiTheme={muiTheme} >
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
