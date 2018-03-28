import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import SearchBar from 'material-ui-search-bar';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import PlusOne from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import {Redirect} from 'react-router-dom'
import {Link} from 'react-router-dom'
const firebase = require('firebase')

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

  export default class NavBar extends Component {
   constructor(props) {
     super(props);
     this.state = {
       logged: true,
       userId:'',
       notificationCount: [],
       noNotificationCount: false,
     };
     firebase.auth().onAuthStateChanged(this.handleUser)
     this.badgesRef = firebase.database().ref().child('badges')
   }
   handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.addListener(user.uid)
     }else {
       this.setState({redirect:true})
     }
   }
   addListener (userId) {
     this.badgesRef.child(userId).on('child_added', (badges)=>{
       this.setState({badges:badges.val()})
     })
     this.badgesRef.child(userId).on('child_changed', (badges)=>{
     this.setState({badges:badges.val()})
     })
   }
   loadNotifications () {
     this.badgesRef.child(this.state.userId).child('notificationsBadges').remove()
     this.setState({badges:false})
   }
   handleLogout (event) {
      firebase.auth().signOut().then(function() {
      }).catch(function(error) {
        // An error happened.
      });
        this.setState({redirect:true})
    }
   render() {
     return (
      this.state.redirect ? <Redirect to='/' push/> :
         <MuiThemeProvider muiTheme={muiTheme} >
           <div>
             <AppBar
               style={{position:'fixed'}}
               iconElementLeft={
                 <div className='col-sm-12' >
                   <Link className='col-sm-4' to='/' >
                   <Avatar
                     src={require("../images/oliverLogo.png")}
                     size={45}
                     style={{backgroundColor:"#2d6ca1", marginTop:'7%'}}
                   />
                 </Link>
                 <div className='hidden-xs col-sm-8'>
                   <SearchBar
                     onChange={() => console.log('onChange')}
                     onRequestSearch={() => console.log('onRequestSearch')}
                     style={{marginTop:'5%'}}
                     placeholder='Search users'
                   />
                 </div>
                 </div>
                 }
               iconElementRight={
                 <div className='col-sm-12'>
                   <Link to={"/courses"}>
                    <FlatButton label="Courses" style={{color:'white'}}/>
                  </Link>
                  <Link to={"/recents"}>
                    <FlatButton label="Activities" style={{color:'white'}}/>
                  </Link>
                  <Link to={"/explore"}>
                    <FlatButton label="Explore" style={{color:'white'}}/>
                  </Link>
                  <Link to={"/bookmarks"}>
                    <FlatButton label="Bookmarks" style={{color:'white'}}/>
                  </Link>
                  <Link onClick={()=>this.loadNotifications()} to={"/notifications"}>
                    <Badge
                      badgeContent={this.state.badges}
                      badgeStyle={{color:'white', backgroundColor: this.state.badges ? 'red' : 'transparent', top:10, left:25, }}
                      style={{cursor:'pointer'}}
                      >
                        <NotificationsIcon  style={{color:'white'}} />
                      </Badge>
                  </Link>
                  <IconMenu
                    iconButtonElement={
                      <Avatar
                        src={this.state.photoURL}
                        size={35}
                        style={{marginBottom:10,cursor:'pointer'}}
                        label='Jane Doe'
                      />}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      open={this.state.openMenu}
                      onRequestChange={this.handleOnRequestChange}
                      >
                        <Divider />
                        <MenuItem primaryText={this.state.username} leftIcon={
                          <Avatar
                            src={this.state.photoURL}
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
                            <MenuItem value="4" primaryText="Privacy" href={'https://oliver.afridash.com/policy'} target='_blank'/>
                            <MenuItem value="4" primaryText="Copyright" />
                          </IconMenu>
                        </div>}
                      />
                      {this.props.children}
                    </div>
                  </MuiThemeProvider>
                );
              }
        }
