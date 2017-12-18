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
import BookMark from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import {Nav, Navbar, NavDropdown, Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import {Firebase} from '../auth/firebase'
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
      seconds: 20,
      timeColor: '#1969a3',
      bookColor: blue300,
      questions:[],
      index:0, //use to navigate questions
      loading:true,
    }
    this.courseId = this.props.match.params.id
    this.timer = 0;
    this.countDown = this.countDown.bind(this)
    this.courseRef = firebase.database().ref().child('user_courses')
    this.questionsRef = firebase.database().ref().child('questions').child(this.courseId)
    firebase.auth().onAuthStateChanged(this.handleUser)
}
  handleUser = (user) => {
    if (user) {
      this.getCourseInfo (user.uid)
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
      console.log(questions.val())
      //If questions are not found under courseId, course does not exist
      if (!questions.exists()) alert('Course Not Found!')
      //Loop through each question
      questions.forEach ((question) => {
        //If answered, add to questions array, and update state of questions
        if (question.val().answered) {
          this.questions.push({key:question.key, answer:question.val().answer, optionA:question.val().optionA,
            optionB:question.val().optionB, optionC:question.val().optionC, optionD:question.val().optionD,question:
            question.val().question, selected:''})
            this.setState({questions:this.questions, loading:false})
        }
      })
    })
    //this.randomizeQuestions(this.questions)
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
  handleBookMark = () => {
    let bColor = this.state.bookColor
    if (bColor == blue300) {
      this.setState({
      bookColor:red500,
    });}
        else{
          this.setState({
          bookColor:blue300,
            });
            }
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
    }
  }
  select = (index) => this.setState({selectedIndex: index});
  selectOption (option) {
    var item  = this.state.questions[this.state.index]
    item.selected = option
    var clone = this.state.questions
    clone[this.state.index] = item
    this.setState({questions:clone})
  }
  render() {
    const {index} = this.state
    return (
        <MuiThemeProvider muiTheme={muiTheme} >
      <div>
        <br/>
        {this.state.loading ? <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
              <br />  <br /><CircularProgress size={60} thickness={7} />
            </div>
              </div>
              :
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
                      Last Score: 60% <br/>
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
                <div onClick={this.handleBookMark}>
                    <BookMark  style={{color:this.state.bookColor, cursor:'pointer'}}/>
                </div>
                        <div style={{textAlign:'center', fontSize:20}} >
                          <div onClick={()=>this.selectOption('A')} className='panel panel-default'  style={{paddingTop:10, margin:3, background: this.state.questions[index].selected === 'A' ? blue300 : 'white', cursor:'pointer'}} >
                            <p style={{fontSize:20}}>{this.state.questions[index].optionA}</p>
                          </div>
                          <div onClick={()=>this.selectOption('B')}  className='panel panel-default' style={{paddingTop:10, margin:3,background:this.state.questions[index].selected === 'B' ? blue300 : 'white',  cursor:'pointer'}} >
                            <p style={{fontSize:20}}>{this.state.questions[index].optionB}</p>
                          </div>
                          <div onClick={()=>this.selectOption('C')} className='panel panel-default' style={{paddingTop:10, margin:3,  background:this.state.questions[index].selected === 'C' ? blue300 : 'white', cursor:'pointer'}} >
                            <p style={{fontSize:20}}>{this.state.questions[index].optionD}</p>
                          </div>
                          <div onClick={()=>this.selectOption('D')} className='panel panel-default' style={{paddingTop:10, margin:3, background:this.state.questions[index].selected === 'D' ? blue300 : 'white', cursor:'pointer'}} >
                            <p style={{fontSize:20}}>{this.state.questions[index].optionC}</p>
                          </div>

                        </div>
                        <div className="col-sm-10 col-sm-offset-1">
                          {index > 0 && <FlatButton label="Previous" onClick={()=>this.setState({index: this.state.index -=1})} style={{position:'absolute',left:0} } />}
                          {index < this.state.questions.length-1 ? <FlatButton label="Next" onClick={()=>this.setState({index: this.state.index +=1})} style={{position:'absolute',right:0,}}   /> :
                          <FlatButton label="Submit" style={{position:'absolute',right:0}}   />
                          }
                            <br/>   <br/>
                        </div>
                      </div>

              </div>
              </div>
          </div>
        </div>
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
