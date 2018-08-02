import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import {Redirect} from 'react-router-dom'
import moment from 'moment'
import {Link} from 'react-router-dom'
import '../styles/styles.css'
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
Logged.muiName = 'IconMenu'
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
     this.usersRef = firebase.database().ref().child('users')
   }
   handleUser = (user) => {
     if (user.photoURL === null) {
       this.setState({username:user.email, userId:user.uid, photoURL:user.photoURL})
     }else {
       this.setState({redirect:true})
     }
   }
   handleLogout (event) {
      firebase.auth().signOut().then(()=> {
          this.setState({redirect:true})
      }).catch((error)=> {
        alert("Error Logging Out")
      });

    }
    handleRequestClose = () => {
      this.setState({
        openMenu:false,
        openMore:false,
        openLargeProfile:false,
        openBurger:false
      })
    }
    handleOnRequestChange = () => {
      this.setState({
        openMenu:false,
        openMore:false,
        openLargeProfile:false,
        openBurger:false
      })
    }
   setSearchText (text) {
    if (this.props.searchPage) {
      this.props.onTextChange(text)
    }else{
      this.setState({searchString:text})
    }
   }
   showSearch () {
     if (!this.props.searchPage) {
       this.setState({showSearchPage:true})
     }else{
       this.props.onSearch()
     }
   }
   render() {
     return (
      this.state.redirect ? <Redirect to='/in-house/login' push/> :
         <MuiThemeProvider muiTheme={muiTheme} >
           <div>
             <AppBar
               style={{position:'fixed'}}
               iconElementLeft={
                 <div className='col-sm-12' >
                   <Link className='col-sm-4' to='/in-house/home' >
                   <Avatar
                     src={require("../images/oliverLogo.png")}
                     size={45}
                     style={{backgroundColor:"#2d6ca1", marginTop:'7%'}}
                   />
                 </Link>
                 </div>
                 }
               iconElementRight={
                 <div className='col-sm-12'>
                    <FlatButton label="Manual Payments" href="/in-house/admin/pay" style={{color:'white'}}/>
                     <IconMenu
                       onClick={()=>this.setState({openMenu:!this.state.openMenu})}
                       iconButtonElement={
                         <div>
                           <FlatButton label={this.state.username} style={{color:'white'}}/>
                         </div>
                        }
                         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}}
                         open={this.state.openMenu}
                         onRequestChange={this.handleOnRequestChange}
                         >
                             <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>
                           </IconMenu>
                  </div>}
                      />
                      {this.props.children}
                    </div>
                  </MuiThemeProvider>
                );
              }
        }
