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
import PlusOne from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Firebase} from '../auth/firebase'
import {Link, Redirect} from 'react-router-dom'
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
       refreshing: false,
       noCourses:false,
       status:'',
     };
     firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
     this.ref = firebase.database().ref().child('user_courses')
   }
  // returnHome = () =>  {
  //   this.state.redirect ? <Redirect to ="/AppHome" push/>
    // };
   handleUser(user){
       if(user){
         this.setState({
          displayName:user.displayName,
          userPhoto:user.photoURL,
          userId:user.uid,
         })
         this.readAddCourses()
       }
     }
   async readAddCourses() {
      /* 1. Set courses to empty before reloading online data to avoid duplicate entries
        2. Retrieve users courses from firebase and store them locally using AsyncStorage */
    this.data = []
    this.setState({refreshing:true})
    await this.ref.child(this.state.userId).once('value', (snapshot)=>{
      if (!snapshot.exists()) {
        this.setState({refreshing:false, noCourses:true})
      }
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, name:course.val().name, code:course.val().code})
        this.setState({data:this.data, refreshing:false,noCourses:false, isLoading:false})
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

  render() {
    var styles = {
      appBar: {
        flexWrap: 'wrap'
      },
      tabs: {
        width: '100%'
      }
    }

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

    const radios = [];
    for (let i = 0; i < 4; i++) {
      radios.push(
        <RadioButton
          key={i}
          value={`value${i + 1}`}
          label={`Option ${i + 1}`}
          style={styles.radioButton}
        />
      );
    }

    return (
        this.state.redirect ? <Redirect to='/' push/> : <MuiThemeProvider muiTheme={muiTheme} >
      <div>

        <AppBar
          iconElementLeft={<Avatar
            src="images/oliverLogo.png"
            size={45}
            style={{backgroundColor:"#2d6ca1"}}
          />}
          children={
            <div>
              <Link to={"/recentActivities"}>
              <FlatButton label="Activities"  style={{color:'white'}}/>
              </Link>
              <FlatButton label="Explore" style={{color:'white'}}/>
              <FlatButton label="Bookmarks" style={{color:'white'}}/>

              <Badge
                 badgeContent={4}
                badgeStyle={{color:'white', backgroundColor:'red', top:10, left:25}}
               >
                 <NotificationsIcon  style={{color:'white'}} />
               </Badge>

               <IconMenu

                iconButtonElement={<Avatar
                  src="images/client_2.png"
                  size={35}
                  style={{marginBottom:10}}
                  label='Jane Doe'
                  //onMouseEnter={this.handleOpenMenu}
                  //onMouseLeave={this.handleCloseMenu}
                />}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                open={this.state.openMenu}
                onRequestChange={this.handleOnRequestChange}
               >
                <Divider />
                 <MenuItem primaryText="Jane Doe" leftIcon={<Avatar
                   src="images/client_2.png"
                   //size={50}
                   //iconStyle={{color:'red'}}
                 />} />
                 <Divider />
                <MenuItem value="1" primaryText="Share" />
                <MenuItem value="2" primaryText="Help" />
                <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>

               </IconMenu>

               <IconMenu
               iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
               anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
               targetOrigin={{horizontal: 'right', vertical: 'top'}}
               iconStyle={{color:'white'}}
               >
               <MenuItem value="1" primaryText="Afridash Oliver" href='https://oliver.afridash.com' target='_blank'/>
               <MenuItem value="2" primaryText="About" href='http://www.afridash.com' target='_blank'/>
               <MenuItem value="3" primaryText="Contact" />
               <MenuItem value="4" primaryText="Privacy" />
               <MenuItem value="4" primaryText="Copyright" />
               </IconMenu>

            <div className='hidden-sm hidden-xs'>
              <SearchBar
              onChange={() => console.log('onChange')}
              onRequestSearch={() => console.log('onRequestSearch')}
              style={{position:'absolute', top:10, left:0, marginLeft:'35%'}}
            />
            </div>
            </div>}
          title="Oliver"

        />
        <br/>

        <div className="row">
          {this.state.data.map((course)=>
            <div className="col-lg-3" >
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
                            <RaisedButton label="Theory" fullWidth={true} style={style.chip} />
                            <RaisedButton label="Objective" fullWidth={true} style={style.chip} />
                            <RaisedButton label="Exam" fullWidth={true} href={"/practice/"+course.key} style={style.chip}/>

                          </div>
                        </div>
                    </div>
                  </div>
                </div> }/>
            </div>
          )}
          </div>
      </div>
       </MuiThemeProvider>
    );
  }
}

export default AppHome;
