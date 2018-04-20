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
import SearchBar from 'material-ui-search-bar'
import Badge from 'material-ui/Badge'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import {Redirect} from 'react-router-dom'
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
      this.state.redirect ? <Redirect to='/' push/> :
         <MuiThemeProvider muiTheme={muiTheme} >
           <div>
             <AppBar
               style={{position:'fixed'}}
               iconElementLeft={
                 <div className='col-sm-12' >
                   <Link className='col-sm-4' to='/dashboard' >
                   <Avatar
                     src={require("../images/oliverLogo.png")}
                     size={45}
                     style={{backgroundColor:"#2d6ca1", marginTop:'7%'}}
                   />
                 </Link>
                 <div className='hidden-xs col-sm-8'>
                   <SearchBar
                     onChange={(text) => this.setSearchText(text)}
                     onRequestSearch={() => this.showSearch()}
                     style={{marginTop:'5%'}}
                     placeholder='Search users'
                   />
                   {this.state.showSearchPage && <Redirect to={'/search/'+this.state.searchString} push />}
                 </div>
                 </div>
                 }
               iconElementRight={
                 <div className='col-sm-12'>
                   <div className="hidden-lg hidden-md ">
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
                           <Link style={{textDecoration:'none'}} to='/profile/'>
                             <MenuItem primaryText={this.state.username} leftIcon={
                               <Avatar
                                 src={this.state.photoURL}
                                 size={35}
                               />} />
                           </Link>
                             <Divider />
                               <Link style={{textDecoration:'none', color:'black'}} to={"/bookmarks"}>
                               <MenuItem value="1" primaryText='Bookmarks' />
                               </Link>
                               <Link style={{textDecoration:'none', color:'black', padding:10}} to={"/recents"}>
                               <MenuItem value="2" primaryText='Recent Activities' />
                               </Link>
                               <Link to='/followers' style={{textDecoration:'none',  color:'black', padding:10}}>
                               <MenuItem value="4" primaryText="Followers" />
                             </Link>
                             <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>
                           </IconMenu>
                           <IconMenu
                             iconButtonElement={<IconButton><Menu /></IconButton>}
                             anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                             targetOrigin={{horizontal: 'right', vertical: 'top'}}
                             iconStyle={{color:'white'}}
                             >
                                 <SearchBar
                                   onChange={(text) => this.setSearchText(text)}
                                   onRequestSearch={() => this.showSearch()}
                                   style={{marginTop:'5%'}}
                                   placeholder='Search users'
                                 />
                                 {this.state.showSearchPage && <Redirect to={'/search/'+this.state.searchString} push />}
                               <Link to='/courses' style={{textDecoration:'none'}}><MenuItem value="2" primaryText="Courses"  /></Link>
                               <Link to='/social' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Social" /></Link>
                               <Link to='/explore' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Explore" /></Link>
                               <Link to='/leaderboard' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Leaderboard" /></Link>
                             </IconMenu>
                   </div>
                   <div className='hidden-sm hidden-xs'>
                     <Link to={"/courses"}>
                      <FlatButton label="Courses" style={{color:'white'}}/>
                    </Link>
                    <Link to={"/social"}>
                      <FlatButton label="social" style={{color:'white'}}/>
                    </Link>
                    <Link to={"/explore"}>
                      <FlatButton label="Explore" style={{color:'white'}}/>
                    </Link>
                    <Link to={"/leaderboard"}>
                      <FlatButton label="Leaderboard" style={{color:'white'}}/>
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
                          <Link style={{textDecoration:'none'}} to='/profile/'>
                            <MenuItem primaryText={this.state.username} leftIcon={
                              <Avatar
                                src={this.state.photoURL}
                                size={35}
                              />} />
                          </Link>
                            <Divider />
                              <Link style={{textDecoration:'none', color:'black'}} to={"/bookmarks"}>
                              <MenuItem value="1" primaryText='Bookmarks' />
                              </Link>
                              <Link style={{textDecoration:'none', color:'black', padding:10}} to={"/recents"}>
                              <MenuItem value="2" primaryText='Recent Activities' />
                              </Link>
                               <Link to='/followers' style={{textDecoration:'none',  color:'black', padding:10}}>
                               <MenuItem value="4" primaryText="Followers" />
                             </Link>
                            <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>
                          </IconMenu>
                          <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            iconStyle={{color:'white'}}
                            >
                              <Link to='/' style={{textDecoration:'none'}}><MenuItem value="2" primaryText="About"  /></Link>
                              <Link to='/policy' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Privacy" /></Link>
                              <MenuItem value="4" primaryText="Copyright @ Afridash Ltd" />
                            </IconMenu>
                   </div>
                  </div>}
                      />
                      {this.props.children}
                    </div>
                  </MuiThemeProvider>
                );
              }
        }
