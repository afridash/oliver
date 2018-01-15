import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import BookMark from 'material-ui/svg-icons/action/bookmark-border';
import Restore from 'material-ui/svg-icons/action/restore';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import {Nav, Navbar, NavDropdown, Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import {Firebase} from '../auth/firebase'
import {Link} from 'react-router-dom'
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
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

const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

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
class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      logged: true,
      selectedIndex: 0,
      divColor: 'white',
      time: {}, //  1800
      seconds: 150,
      correct:0,
      finished:false,
      shareExplore:false,
      timeColor: '#1969a3',
      bookColor:[],
      questions:[],
      index:0, //use to navigate questions
      isloading:true,
      noActivity:false,
      messages:[{key:1, message:'Want to beat my high score ?!'},
                {key:2, message:'I just finished practicing! Want to try?'},
                {key:3, message:'Hey all, check out my score!'},
                {key:4, message:'Cool! I did great! Try it'} ]
    }
    this.courseId = this.props.match.params.id
    this.timer = 0;
    this.countDown = this.countDown.bind(this)
    this.courseRef = firebase.database().ref().child('user_courses')
    this.questionsRef = firebase.database().ref().child('questions').child(this.courseId)
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.usersRef = firebase.database().ref().child('users')
    this.exploreRef = firebase.database().ref().child('explore')
    this.followersRef = firebase.database().ref().child('question_followers')
    this.statsRef = firebase.database().ref().child('student_stats')
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
}
  handleUser = (user) => {
    if (user) {
      this.setState({username:user.displayName, userId:user.uid, profilePicture:user.photoURL})
      this.getCourseInfo (user.uid)
      this.usersRef.child(user.uid).child('collegeId').once('value', (college)=>{
        this.setState({ collegeId :college.val()})
         })
    }
  }
  getCourseInfo (userId) {
    this.courseRef.child(userId).child(this.courseId).once('value', (course) => {
      this.setState({
        key:course.key,
        courseId:course.key,
        code:course.val().code,
        courseCode:course.val().code,
        course:course.val().name,
        title:course.val().name,
        highScore:course.val().highScore})
    })
  }
  componentWillMount () {
    this.getQuestions()
  }
  async getQuestions () {
    //Get questions from questions db using courseId
    await this.questionsRef.orderByChild('type').equalTo('objective').once('value', (questions)=> {
      this.questions = []
    //  console.log(questions.val())
      //If questions are not found under courseId, course does not exist
      if (!questions.exists()) {
        this.setState({isloading:false,noActivity:true})
      }
      //Loop through each question
      questions.forEach ((question) => {
        //If answered, add to questions array, and update state of questions
        if (question.val().answered) {
          var answer = ''
          if (question.val().answer.toLowerCase() === 'a') answer = question.val().optionA
          if (question.val().answer.toLowerCase() === 'b') answer = question.val().optionB
          if (question.val().answer.toLowerCase() === 'c') answer = question.val().optionC
          if (question.val().answer.toLowerCase() === 'd') answer = question.val().optionD

          this.questions.push({key:question.key, answer:question.val().answer, optionA:question.val().optionA,
            optionB:question.val().optionB, optionC:question.val().optionC, optionD:question.val().optionD, show:answer,question:
            question.val().question})

            this.setState({questions:this.questions,})
        }
      })
    })
    //this.randomizeQuestions(this.questions)
    this.randomizeQuestions()
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
    this.questions = []
    var i=0
    while (true) {
      if (i===maxQuestions) break
        var item = this.state.questions[Math.floor(Math.random()*num2)]; //Select random item from the questions
        if (!objsArray[item.key]) { //Confirm if it has not been selecte before
          this.questions.push(item) //Store the question
          objsArray[item.key] = 1
          i +=1 //Increment number of uniquely selected elements
        }
    }
    this.setState({questions:this.questions, total:maxQuestions, isloading:false, index:0})
  }

  restart () {
    this.getQuestions()
    this.setState({
      isloading:true,
      finished:false,
      correct:0,
      seconds: 150,
      time: this.secondsToTime(150),
      timeColor: '#1969a3',
      questions:[]
    })
    this.timer = 0
  if (this.timer === 0) {
    this.timer = setInterval(this.countDown, 1000);
      }
        this.setState({shareExplore:false})
    }

  bookmarkQuestion (question){
  /*
  * Determine if question has been bookmarked previously, remove it, else add it to firebase
  * Negate the value of bookmarked and update the UI
  */

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

  shareToExplore () {
    /*
    * Select a random message,
    * Get data about the user and course
    * Save too explore and alert the user
    * Go back home
    */
    var num = this.state.messages.length
    var item = this.state.messages[Math.floor(Math.random()*num)]
    var data = {
        profilePicture:this.state.profilePicture,
        username:this.state.username,
        course:this.state.course,
        courseCode:this.state.courseCode,
        courseId:this.state.courseId,
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        message: item.message,
        starCount:0,
        userId:this.state.userId,
        percentage: (this.state.correct/this.state.total * 100).toFixed(2)
    }

    var item = this.exploreRef.child(this.state.collegeId).push()
    var key = item.key
    item.setWithPriority(data, 0 - Date.now())
    this.followersRef.child(key).child(this.state.userId).set(true)
    var ref = this.statsRef.child(this.state.userId).child('explore_posts').once('value', (snapshot)=>{
      if (snapshot.exists()) snapshot.ref.set(snapshot.val() + 1)
      else snapshot.ref.set(1)
    })
    //alert("Your post was shared")
      this.setState({shareExplore:true})
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
  /*selectOption (option) {
    var item  = this.state.questions[this.state.index]
    item.selected = option
    var clone = this.state.questions
    clone[this.state.index] = item
    this.setState({questions:clone})
  }*/
  handleBookmark = (question) => {

      console.log(question)
          }
  componentDidMount() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
        }
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
      this.setState({finished:true})

    }
  }
  select = (index) => this.setState({selectedIndex: index});
  /*selectOption (option) {
    var item  = this.state.questions[this.state.index]
    item.selected = option
    var clone = this.state.questions
    clone[this.state.index] = item
    this.setState({questions:clone})
  }*/

  selectOption (option, text) {
    /*
    * Determine if the selected option is right (increase the score)
    * Determine if the selected option is the wrong answer after a correct option has been previously selected (decrease the score)
    * Update the UI with the selected option
    */
    var clone = this.state.questions
    if (option.toLowerCase() !== clone[this.state.index].selected && option.toLowerCase() === clone[this.state.index].answer.toLowerCase().trim() )
    this.setState({correct:this.state.correct + 1})
    else if (clone[this.state.index].selected === clone[this.state.index].answer.toLowerCase() && option.toLowerCase() !== clone[this.state.index].answer.toLowerCase() )
    this.setState({correct:this.state.correct - 1})
    clone[this.state.index].textSelected = text
    clone[this.state.index].selected = option
    this.setState({questions:clone})
  }

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

    const {index} = this.state
    var question = this.state.questions[this.state.index]
    return(
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
                    High Score: 70% <br/>
                    Last Score: 50% <br/>
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

              <div onClick={()=>this.bookmarkQuestion(question)}>

                {question.bookmark ?    <BookMark  style={{color:red500, cursor:'pointer'}}/>:
                 <BookMark  style={{color:blue300,cursor:'pointer'}}/>}
              </div>
                      <div style={{textAlign:'center', fontSize:20}} >
                        <div onClick={()=>this.selectOption('A', this.state.questions[index].optionA)} className='panel panel-default'  style={{paddingTop:10, margin:3, background: this.state.questions[index].selected === 'A' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{question.optionA}</p>
                        </div>
                        <div onClick={()=>this.selectOption('B', this.state.questions[index].optionB)}  className='panel panel-default' style={{paddingTop:10, margin:3,background:this.state.questions[index].selected === 'B' ? blue300 : 'white',  cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionB}</p>
                        </div>
                        <div onClick={()=>this.selectOption('C', this.state.questions[index].optionC)} className='panel panel-default' style={{paddingTop:10, margin:3,  background:this.state.questions[index].selected === 'C' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionD}</p>
                        </div>
                        <div onClick={()=>this.selectOption('D', this.state.questions[index].optionD)} className='panel panel-default' style={{paddingTop:10, margin:3, background:this.state.questions[index].selected === 'D' ? blue300 : 'white', cursor:'pointer'}} >
                          <p style={{fontSize:20}}>{this.state.questions[index].optionC}</p>
                        </div>

                      </div>
                      <div className="col-sm-10 col-sm-offset-1">
                        {index > 0 && <FlatButton label="Previous" onClick={()=>this.setState({index: this.state.index -=1})} style={{position:'absolute',left:0} } />}
                        {index < this.state.questions.length-1 ? <FlatButton label="Next" onClick={()=>this.setState({index: this.state.index +=1})} style={{position:'absolute',right:0,}}   /> :
                        <FlatButton onClick={()=>this.setState({finished:true})} label="Submit" style={{position:'absolute',right:0}}   />

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

  _sharetoExplore = ()  =>  {
    return (
      <div>
        <Paper style={{padding:10,  textAlign:'center',backgroundColor:red500}} zDepth={2}
          children={<div>
          <p style={{fontSize:15,color:'white'}}>Thanks for Sharing to  Explore !</p>

        </div>
      }/>

      </div>


    )
  }

  showSummary () {
   return (
    <div className="container">
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
          <h3 style={{fontSize:30, padding:40}}> Score: {this.state.correct}/{this.state.questions.length} ({(this.state.correct/this.state.total * 100).toFixed(2)}%)</h3>
          <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
              <RaisedButton   onClick={()=>this.restart()} label="Another One !" backgroundColor={blue300} labelColor={'white'} fullWidth={true}  style={{margin: 4,
              backgroundColor:'#cfecf7',}} />
              </div>

                <div className="col-sm-10 col-sm-offset-1">
              <div className="row">
                <div className="col-sm-6">
                <Link to='/apphome' style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary"> RETURN HOME </Link>
              </div>

                <div className="col-sm-6">

                <button onClick={()=>this.shareToExplore()} disabled={this.state.shareExplore} name="share" style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary">
                  SHARE</button>

                  </div>



          </div>
          {
            (()=>{
            if (this.state.shareExplore){

              return this._sharetoExplore()
            }

          })()
          }

              </div>

            </div>
          </div>
        </div>

        <div className="col-lg-8">
            {this.state.questions.map((question)=>
          <Paper  zDepth={2}
            children={<div>
           <div className="panel panel-default">
             <div className="panel-heading">
            <p style={{ fontSize:20}}> {question.question} </p>
             </div>
             <div className="panel-body">
               <div style={{fontSize:20}} >

                 <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: {question.show} </p></div>
                 <div  className='panel panel-default' style={{borderColor:'red',paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: {question.textSelected} </p></div>


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
          else if (this.state.finished) {
            return this.showSummary()

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
