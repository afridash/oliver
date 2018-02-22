import React, {Component} from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
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
const styles = {
  radioButton: {
    marginTop: 16,
  },
};

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
const iconStyles = {
  marginRight: 24,
};
const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);
function handleClick() {
  alert('You clicked the Chip.');
}

 class AppHome extends Component {
   constructor(props) {
     super(props);
     this.state = {
       open: false,
       logged: true,
       selectedIndex: 0,
       name:'',
       code:'',
       data:[],
       isLoading: true,
       noCourses:false,
       status:'',
     };
     firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
     this.ref = firebase.database().ref().child('user_courses')
   }
   handleUser(user){
       if(user){
         this.setState({
          displayName:user.displayName,
          userPhoto:user.photoURL,
          userId:user.uid,
         })
         this.readAddCourses()
       }else{
         this.setState({redirect:true})
       }
     }
   async readAddCourses() {
      /* 1. Set courses to empty before reloading online data to avoid duplicate entries
        2. Retrieve users courses from firebase and store them locally using AsyncStorage */
    this.data = []
    await this.ref.child(this.state.userId).once('value', (snapshot)=>{
      if (!snapshot.exists()) {
        this.setState({isLoading:false, noCourses:true})
      }
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, name:course.val().name, code:course.val().code})
        this.setState({data:this.data, refreshing:false, noCourses:false, isLoading:false})
      })
    })
  }
  handleChange = (event, logged) => {
    this.setState({logged: logged});
  }
  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
  }
  handleOpenMenu = () => {
   this.setState({
     openMenu: true,
   });
 }
 handleLogout (event) {
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
      // An error happened.
    });
      this.setState({redirect:true})
    }

  handleOpen = () => {
  this.setState({open: true});
 };
  handleClose = () => {
    this.setState({open: false});
  };
  select = (index) => this.setState({selectedIndex: index});
  showPageContent () {
    var styles = {
      appBar: {
        flexWrap: 'wrap'
      },
      tabs: {
        width: '100%'
      }
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
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
        <div>
          <div className="row">
            {this.state.data.map((course)=>
              <div className="col-lg-4" >
                <Paper style={style.paper} zDepth={2} rounded={true}
                  children={<div>
                    <div className="row">
                      <div className='col-sm-4'>
                        <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                          <div className="panel-heading" style={{background:blue300,color:'white'}}> {course.code} </div>
                          <div className="panel-body">
                            <h3 style={{fontSize:15}}>HIGH SCORE</h3>
                            <h3 style={{fontSize:15}}> 50% </h3> </div>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div>
                          <Paper style={style} zDepth={2}
                            children={<div>
                            <p>{course.name}</p>
                          </div>}/>
                        </div>
                          <div className="row">
                            <div className="col-sm-10 col-sm-offset-1">
                              <Link to={"/theory/"+course.key}>
                                <RaisedButton label="Theory" fullWidth={true} style={style.chip} />
                              </Link>
                              <Link to={"/objective/"+course.key}>
                                <RaisedButton label="Objective" fullWidth={true} style={style.chip} />
                              </Link>
                              <Link to={"/practice/"+course.key}>
                                <RaisedButton label="Exam" fullWidth={true} style={style.chip}/>
                              </Link>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div> }/>
              </div>
            )}
            </div>
          { this.state.redirect && <Redirect to='/' push/>}
        </div>
         </MuiThemeProvider>
    )
  }
  loading () {
    const muiTheme = getMuiTheme({
       palette: {
         textColor: '#424242',
       },
       appBar: {
         height: 50,
         color:'#2d6ca1',
       },
     })
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <CircularProgress size={60} thickness={5} />
        </div>
        </div>
      </MuiThemeProvider>
    )
  }
  showNoCourses () {
    const muiTheme = getMuiTheme({
       palette: {
         textColor: '#424242',
       },
       appBar: {
         height: 50,
         color:'#2d6ca1',
       },
     })
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p>No Courses...Search To Add</p>
        </div>
        </div>
      </MuiThemeProvider>
    )
  }
  render() {
      if (this.state.isLoading) {
        return this.loading()
      }else if (this.state.noCourses) {
        return this.showNoCourses()
      }else {
        return this.showPageContent()
      }
  }
}

export default AppHome;
