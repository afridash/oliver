import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import {red500} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import BookMark from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import CircularProgress from 'material-ui/CircularProgress';
import Summary from './PracticeSummary'
import { Button} from 'react-bootstrap';
import {Firebase} from '../auth/firebase'
import {
  blue300,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const style = {
  chip: {
    margin: 4,
    width:'100%',
    backgroundColor:'#cfecf7',

  },
  paper:{
    textAlign: 'center',
    margin: 20,
  },
  button: {
    margin: 3,
  },
};
const iconStyles = {
  marginRight: 24,
};

 const muiTheme = getMuiTheme({
   palette: {
     textColor: '#424242',
   },
   appBar: {
     height: 50,
     color:'#2d6ca1',
   },
 })
class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      logged: true,
      selectedIndex: 0,
      divColor: 'white',
      time: {}, //  1800
      seconds: 1800,
      timeColor: '#1969a3',
      bookColor: blue300,
      questions:[],
      index:0, //use to navigate questions
      isloading:true,
      noActivity:false,
      correct:0,
      highest:0,
      last:0
    }
    this.courseId = this.props.match.params.id
    this.timer = 0;
    this.countDown = this.countDown.bind(this)
    this.courseRef = firebase.database().ref().child('user_courses')
    this.questionsRef = firebase.database().ref().child('questions').child(this.courseId)
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.historyRef = firebase.database().ref().child('activities')
    this.statsRef = firebase.database().ref().child('student_stats').child(this.courseId)
    this.userStats = firebase.database().ref().child('user_stats')
    this.oliverStats = firebase.database().ref().child('oliver_stats')
    this.courseActivitiesRef = firebase.database().ref().child('course_activities').child(this.courseId)
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
}
  handleUser = (user) => {
    if (user) {
      this.getCourseInfo (user.uid)
      this.setState({userId:user.uid, })
      this.getStats(user.uid)
    }
  }
  getCourseInfo (userId) {
    this.courseRef.child(userId).child(this.courseId).once('value', (course) => {
      this.setState({code:course.val().code, title:course.val().name})
    })
  }
  componentWillMount () {
    this.getQuestions()

  }
  async getQuestions () {
    //Get questions from questions db using courseId
    await this.questionsRef.orderByChild('type').equalTo('objective').once('value', (questions)=> {
      this.questions = []
      //If questions are not found under courseId, course does not exist
      if (!questions.exists()) {
        this.setState({isloading:false,noActivity:true})
      }
      //Loop through each question
      questions.forEach ((question) => {
        //If answered, add to questions array, and update state of questions
        if (question.val().answered) {
          var answer
          if (question.val().answer.toUpperCase() === 'A') answer = question.val().optionA
          else if (question.val().answer.toUpperCase() === 'B') answer = question.val().optionB
          else if (question.val().answer.toUpperCase() === 'C') answer = question.val().optionC
          else answer = question.val().optionD
          this.questions.push({key:question.key, answer:question.val().answer.toUpperCase(), optionA:question.val().optionA,
            optionB:question.val().optionB, optionC:question.val().optionC, optionD:question.val().optionD,question:
            question.val().question, selected:'', textAnswer:answer});

        }
      })
      this.setState({questions:this.questions, isloading:false, noActivity:this.questions.length > 0 ? false : true })
      if (this.timer == 0) {
        this.timer = setInterval(this.countDown, 1000);
      }
    })
    this.randomizeQuestions()
  }
  async getStats(userId){
    await this.statsRef.child(userId).once('value', (stats)=>{
      if (stats.exists()) {
        this.setState({
          highest:stats.val().highest,
          last:stats.val().last
        })
      }
    })
  }
  randomizeQuestions () {
    /*
    * Determine if there are more than 50 questions, set max num to 50, or set max num to questions.length
    * Set the maximum number to generate a random number to questions.length
    * Iterate over questions to select a random item, add it to questions, and increment counter
    * If counter equals maxQuestions, break and set questions
    */
    var maxQuestions
    if (this.state.questions.length > 20) maxQuestions = 20
    else maxQuestions = this.state.questions.length
    var num2 = this.state.questions.length //Max num to generate random questions
    var objsArray = []
    var questions = []
    var i=0
    while (true) {
      if (i===maxQuestions) break
        var item = this.state.questions[Math.floor(Math.random()*num2)]; //Select random item from the questions
        if (!objsArray[item.key]) { //Confirm if it has not been selecte before
          questions.push(item) //Store the question
          objsArray[item.key] = 1
          i +=1 //Increment number of uniquely selected elements
        }
    }
    this.setState({questions:questions, total:maxQuestions})
  }
  handleFocus = () =>  {
    this.setState({ divColor: '#cfecf7'});
    }
  changeColor = () =>  {
    this.setState({ divColor: blue300});
    };
  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
  handleBookMark (question) {
    if (question.bookmark) {
      this.bookmarksRef.child(this.state.userId).child(question.key).remove()
      var ref = this.statsRef.child(this.state.userId).child('total_bookmarked').once('value', (snapshot)=>{
        if (snapshot.exists()) snapshot.ref.set(snapshot.val() - 1)
      })
    }else {
      this.bookmarksRef.child(this.state.userId).child(question.key).update(question)
      var ref = this.statsRef.child(this.state.userId).child('total_bookmarked').once('value', (snapshot)=>{
        if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
        else snapshot.ref.set(1)
      })
    }
    question.bookmark = !question.bookmark
    var clone = this.state.questions
    clone[this.state.index] = question
    this.setState({questions:clone})
  }
  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    if (seconds == 10) {
      this.setState({
      timeColor:'red',
        });
    }
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }
  async restart () {
    await this.setState({index:0, showSummary:false,correct:0, questions:this.questions})
    this.randomizeQuestions()
  }
  saveCompleted () {
    //this._saveHigh()
    this._saveToHistory()
  }
  _saveToHistory (){
    var data = {
      title:this.state.title,
      code:this.state.code,
      createdAt:firebase.database.ServerValue.TIMESTAMP,
      score:this.state.correct,
      total:this.state.total,
      percentage:(this.state.correct/this.state.total * 100).toFixed(2)
    }
    var item = this.historyRef.child(this.state.userId).push()
    item.setWithPriority(data, 0 - Date.now())
    var activity = this.courseActivitiesRef.child(this.state.userId).push()
    activity.setWithPriority(data, 0 - Date.now())
    this._updateStats()
  }
  async _updateCourseStats () {
    //Save to number of tests completed
    var score = (this.state.correct/this.state.total * 100).toFixed(2)
    await this.statsRef.child(this.state.userId).once('value', (snapshot)=>{
      if (snapshot.exists()) {
        snapshot.ref.update({total_completed:snapshot.val().total_completed + 1, last:score})

        if (snapshot.hasChild('highest')) {
          var highest = snapshot.val().highest
          if (highest < score) {
            snapshot.ref.update({highest:score})
          }
        }else {
          snapshot.ref.update({highest:score})
        }

      } else{
        snapshot.ref.update({total_completed: 1, highest:score, last:score})
      }
    })
  }
  async _updateGeneralStats() {
    //Update oliver completed stats
    await this.oliverStats.child('completed').once('value', (snapshot)=> {
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
  }
  async _updateUserStats() {
    var score = (this.state.correct/this.state.total * 100).toFixed(2)
    //Update student total completed and highest
    await this.userStats.child(this.state.userId).once('value', (snapshot)=>{
      //Update completed
      if (snapshot.exists()) {
        if (snapshot.hasChild('completed')) {
          snapshot.ref.update({completed:snapshot.val().completed + 1})
        }else{
          snapshot.ref.update({completed:1})
        }
      //Update highest and last
        if (snapshot.hasChild('last')) {
          var highest = snapshot.val().highest
          if (highest < score) {
            snapshot.ref.update({highest:score})
          }
        }else{
          snapshot.ref.update({highest:score})
        }
        snapshot.ref.update({last:score})
      }else {
        snapshot.ref.update({
          completed:1,
          highest:score,
          last:score
        })
      }
    })
  }
  async _updateStats () {
    await this._updateCourseStats()
    await this._updateGeneralStats()
    await this._updateUserStats()
    await this.setState(prevState =>({showSummary:!prevState.showSummary}))
  }
  select = (index) => this.setState({selectedIndex: index});
  async selectOption (option, text) {
    var item  = this.state.questions[this.state.index]

    if (option !== item.selected && option === item.answer.trim() ) {
      await this.setState({correct:this.state.correct + 1})
    } else if (item.selected === item.answer && option !== item.answer ) {
      await this.setState({correct:this.state.correct - 1})
    }
    var clone = this.state.questions
    item.textSelected = text
    item.selected = option
    clone[this.state.index] = item
    this.setState({questions:clone})
  }
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
          <p className='text-info lead'>No Answered Objectives...</p>
          <Link to={"/AppHome"}>
            <RaisedButton label="Return Home" primary={true} fullWidth={true} style={style.chip}/>
          </Link>
        </div>
        </div>
    )
  }
  showExams () {
    const {index} = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4 ">
            <div className="panel panel-info">
              <div>
                <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300}} zDepth={2}
                  children={<div>
                  <p style={{fontSize:20,color:'white'}}>{this.state.code}</p>

                </div>
              }
                 />
              </div>
              <div className="panel-body" >
                <div className="row">
                  <div className="col-lg-6" style={{textShadow:"2px 2px 5px #cfecf7"}}>
                    High Score: {this.state.highest}% <br/>
                    Last Score: {this.state.last}% <br/>
                  </div>
                <div className="col-lg-6" style={{marginTop:-10,fontSize:40,color:this.state.timeColor, textAlign:'right'}}> {this.state.time.m} : {this.state.time.s} </div>
                </div>
                  <div style={{padding:10, textAlign:'center'}}>
                    <p style={{ fontSize:20}}>   Navigation </p>
                </div>
                  <div className="btn-toolbar"  >
                    {this.state.questions.map((question, key)=>
                      <Button onClick={()=>this.setState({index:key})} style={{margin:3, background:question.selected && blue300}}>{key+1}</Button>
                    )}
                    <br/>
                  </div>
              </div>
            </div>
          </div>
        <div className="col-lg-8 ">
            <div className="panel panel-info">
              <div>
                <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300}} zDepth={2}
                  children={<div>
                  <p style={{fontSize:20,color:'white'}}>{this.state.title}</p>

                </div>
              }
                 />
              </div>
            <div className="panel-body">
            <p style={{padding:10, fontSize:20}}>{index+1}. {this.state.questions[index].question}</p>
              <div onClick={()=>this.handleBookMark(this.state.questions[index])}>
                  <BookMark  style={{color:this.state.questions[index].bookmark ? red500 : blue300, cursor:'pointer'}}/>
              </div>
                      <div style={{textAlign:'center', fontSize:20}} >
                        <div onClick={()=>this.selectOption('A', this.state.questions[index].optionA)} className='panel panel-default'  style={{paddingTop:10, margin:3, background: this.state.questions[index].selected === 'A' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionA}</p>
                        </div>
                        <div onClick={()=>this.selectOption('B', this.state.questions[index].optionB)}  className='panel panel-default' style={{paddingTop:10, margin:3,background:this.state.questions[index].selected === 'B' ? blue300 : 'white',  cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionB}</p>
                        </div>
                        <div onClick={()=>this.selectOption('C', this.state.questions[index].optionC)} className='panel panel-default' style={{paddingTop:10, margin:3,  background:this.state.questions[index].selected === 'C' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionC}</p>
                        </div>
                        <div onClick={()=>this.selectOption('D', this.state.questions[index].optionD)} className='panel panel-default' style={{paddingTop:10, margin:3, background:this.state.questions[index].selected === 'D' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionD}</p>
                        </div>

                      </div>
                      <div className="col-sm-10 col-sm-offset-1">
                        {index > 0 && <FlatButton label="Previous" onClick={()=>this.setState({index: this.state.index -=1})} style={{position:'absolute',left:0} } />}
                        {index < this.state.questions.length-1 ? <FlatButton label="Next" onClick={()=>this.setState({index: this.state.index +=1})} style={{position:'absolute',right:0,}}   /> :
                        <FlatButton onClick={()=>this.saveCompleted()} label="Submit" style={{position:'absolute',right:0}}   />
                        }
                          <br/>   <br/>
                      </div>
                    </div>

            </div>
            </div>
        </div>
      </div>
    )
  }
  showPageContent () {
    return(
      this.state.showSummary ? <Summary courseTitle={this.state.title} code={this.state.code} courseId={this.courseId} restart={this.restart.bind(this)} questions={this.state.questions} correctAnswers={this.state.correct} /> : this.showExams()
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
        <br/>

      <Paper className='hidden-sm hidden-xs' zDepth={1} style={{bottom:0, position:'absolute', width:'100%'}}>

     </Paper>


      </div>
       </MuiThemeProvider>
    );
  }
}

export default Practice;
