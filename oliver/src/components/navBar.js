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
     this.badgesRef = firebase.database().ref().child('badges')
     this.usersRef = firebase.database().ref().child('users')
   }
   handleUser = (user) => {
     if (user) {
       this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
       this.addListener(user.uid)
       this.checkPaid(user.uid)
     }else {
       this.setState({redirect:true})
     }
   }
   checkPaid (userId) {
     this.usersRef.child(userId).once('value', (student)=>{
       if(!student.hasChild('has_paid') || student.val().has_paid === false){
         this.setState({notPaid:true})
       }else{
         let date = moment(student.val().paid_on).add(1, 'years').calendar()
         let current = moment().format('L')
         if (date === current){
           this.usersRef.child(this.state.userId).update({
             has_paid:false
           })
         }
       }
     })
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
                       onClick={()=>this.setState({openMenu:!this.state.openMenu})}
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
                             <MenuItem onClick={this.handleRequestClose} primaryText={this.state.username} leftIcon={
                               <Avatar
                                 src={this.state.photoURL}
                                 size={35}
                               />} />
                           </Link>
                             <Divider />
                               <Link onClick={this.handleRequestClose} style={{textDecoration:'none', color:'black'}} to={"/bookmarks"}>
                               <MenuItem value="1" primaryText='Bookmarks' />
                               </Link>
                               <Link onClick={this.handleRequestClose} style={{textDecoration:'none', color:'black', padding:10}} to={"/recents"}>
                               <MenuItem value="2" primaryText='Recent Activities' />
                               </Link>
                               <Link onClick={this.handleRequestClose} to='/followers' style={{textDecoration:'none',  color:'black', padding:10}}>
                               <MenuItem value="4" primaryText="Followers" />
                             </Link>
                             <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>
                           </IconMenu>
                           <IconMenu
                             onClick={()=>this.setState({openMore:!this.state.openMore})}
                             iconButtonElement={<IconButton><Menu /></IconButton>}
                             anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                             targetOrigin={{horizontal: 'right', vertical: 'top'}}
                             iconStyle={{color:'white'}}
                             open={this.state.openMore}
                             onRequestChange={this.handleOnRequestChange}
                             >
                                 <SearchBar
                                   onChange={(text) => this.setSearchText(text)}
                                   onRequestSearch={() => this.showSearch()}
                                   style={{marginTop:'5%'}}
                                   placeholder='Search users'
                                 />
                                 {this.state.showSearchPage && <Redirect to={'/search/'+this.state.searchString} push />}
                               <Link onClick={this.handleRequestClose} to='/courses' style={{textDecoration:'none'}}><MenuItem value="2" primaryText="Courses"  /></Link>
                               <Link onClick={this.handleRequestClose} to='/social' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Social" /></Link>
                               <Link onClick={this.handleRequestClose} to='/explore' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Explore" /></Link>
                               <Link onClick={this.handleRequestClose} to='/leaderboard' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Leaderboard" /></Link>
                               <Link onClick={this.handleRequestClose} to='/uploads' style={{textDecoration:'none'}}><MenuItem primaryText="Upload Questions" /></Link>
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
                        onClick={()=>this.setState({openLargeProfile:!this.state.openLargeProfile})}
                        open={this.state.openLargeProfile}
                        onRequestChange={this.handleOnRequestChange}
                        >
                          <Link style={{textDecoration:'none'}} to='/profile/'>
                            <MenuItem onClick={this.handleRequestClose} primaryText={this.state.username} leftIcon={
                              <Avatar
                                src={this.state.photoURL}
                                size={35}
                              />} />
                          </Link>
                            <Divider />
                              <Link onClick={this.handleRequestClose} style={{textDecoration:'none', color:'black'}} to={"/bookmarks"}>
                              <MenuItem value="1" primaryText='Bookmarks' />
                              </Link>
                              <Link onClick={this.handleRequestClose} style={{textDecoration:'none', color:'black', padding:10}} to={"/recents"}>
                              <MenuItem value="2" primaryText='Recent Activities' />
                              </Link>
                               <Link onClick={this.handleRequestClose} to='/followers' style={{textDecoration:'none',  color:'black', padding:10}}>
                               <MenuItem value="4" primaryText="Followers" />
                             </Link>
                            <MenuItem value="3" primaryText="Sign out" onClick={(event) => this.handleLogout(event)}/>
                          </IconMenu>
                          <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            iconStyle={{color:'white'}}
                            onClick={()=>this.setState({openBurger:!this.state.openBurger})}
                            open={this.state.openBurger}
                            onRequestChange={this.handleOnRequestChange}
                            >
                              <Link onClick={this.handleRequestClose} to='/' style={{textDecoration:'none'}}><MenuItem value="2" primaryText="About"  /></Link>
                              <Link onClick={this.handleRequestClose} to='/policy' style={{textDecoration:'none'}}><MenuItem value="4" primaryText="Privacy" /></Link>
                              <Link onClick={this.handleRequestClose} to='/uploads' style={{textDecoration:'none'}}><MenuItem primaryText="Upload Questions" /></Link>
                              <MenuItem value="4" primaryText="Copyright @ Afridash Ltd" />
                            </IconMenu>
                   </div>
                   {this.state.notPaid && <Redirect to='/pay' push />}
                  </div>}
                      />
                      {this.props.children}
                    </div>
                  </MuiThemeProvider>
                );
              }
        }
