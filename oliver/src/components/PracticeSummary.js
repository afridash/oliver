import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
import * as firebase from 'firebase'
import {
  blue300,
} from 'material-ui/styles/colors'
/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
 const muiTheme = getMuiTheme({
   palette: {
     textColor: '#424242',
   },
   appBar: {
     height: 50,
     color:'#2d6ca1',
   },
 })
export default class PracticeSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions:this.props.questions,
      correctAnswers:this.props.correctAnswers,
      totalQuestions:this.props.questions.length,
      messages:[{key:1, message:'Want to beat my high score ?!'},
                {key:2, message:'I just finished practicing! Want to try?'},
                {key:3, message:'Hey all, check out my score!'},
                {key:4, message:'Cool! I did great! Try it'} ]
    };
    this.exploreRef = firebase.database().ref().child('explore')
    this.followersRef = firebase.database().ref().child('question_followers')
    this.statsRef = firebase.database().ref().child('student_stats').child(this.props.courseId)
    this.usersRef = firebase.database().ref().child('users')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {

      this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
        this.setState({
          isAvailable:true,
          username:user.displayName,
          userId:user.uid,
          profilePicture:user.photoURL,
          college:college.val()
        })
      })
    }
  }
  shareToExplore () {
    /*
    * Select a random message,
    * Get data about the user and course
    * Save to explore and alert the user
    * Go back home
    */
    var num = this.state.messages.length
    var message = this.state.messages[Math.floor(Math.random()*num)]
    var data = {
        profilePicture:this.state.profilePicture,
        username:this.state.username,
        course:this.props.courseTitle,
        courseCode:this.props.code,
        courseId:this.props.courseId,
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        message: message.message,
        starCount:0,
        userId:this.state.userId,
        percentage: (this.state.correctAnswers/this.state.totalQuestions * 100).toFixed(2)
    }
    var item = this.exploreRef.child(this.state.college).push()
    var key = item.key
    item.setWithPriority(data, 0 - Date.now())
    this.followersRef.child(key).child(this.state.userId).set(true)
    this.statsRef.child(this.state.userId).child('explore_posts').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
    alert('Thank you for sharing to explore! Kudos')
    this.setState({isAvailable:false})
  }
  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme} >
      <div>
        <br/>
        <div className="container">
          <div style={{marginTop:60}}></div>
          <div className="row">
            <div className="col-lg-4">
              <div className="panel panel-default">
                <div>
                  <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300}} zDepth={2}
                    children={<div>
                    <p style={{fontSize:30,color:'white'}}>Result</p>
                  </div>
                }/>
                </div>
              <h3 style={{fontSize:30, padding:40}}> Score: {this.state.correctAnswers + '/' + this.state.totalQuestions} ({(this.state.correctAnswers/this.state.totalQuestions * 100).toFixed(2)}%)</h3>
              <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                  <RaisedButton onClick={()=>this.props.restart()} label="Another One !" backgroundColor={blue300} labelColor={'white'} fullWidth={true}  style={{margin: 4,
                  backgroundColor:'#cfecf7',}} />
                  </div>
                  <div className="col-sm-10 col-sm-offset-1">
                  <div className="row">
                    <div className="col-sm-6">
                    <Link to='/apphome' style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary"> RETURN HOME </Link>
                  </div>
                    <div className="col-sm-6">
                      {this.state.isAvailable &&
                    <button onClick={()=>this.shareToExplore()} style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary">
                      SHARE
                    </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {this.state.questions.map((question, key)=>
                <Paper  zDepth={2}
                  children={<div>
                 <div className="panel panel-default">
                   <div className="panel-heading">
                  <p style={{ fontSize:20}}> {key+1}.  {question.question} </p>
                   </div>
                   <div className="panel-body">
                     <div style={{fontSize:20}} >
                       <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: {question.textAnswer}</p></div>
                       <div  className='panel panel-default' style={{borderColor:question.selected === question.answer ? '#004d40' : 'red',paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: {question.textSelected}</p></div>
                     </div>
                   </div>
                 </div>
               </div>
             }/>
              )}

            </div>
          </div>
        </div>



      </div>
       </MuiThemeProvider>
    );
  }
}
