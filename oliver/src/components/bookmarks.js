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
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import SearchBar from 'material-ui-search-bar';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import BookMark from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import {Link} from 'react-router-dom'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import {Nav, Navbar, NavDropdown, Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';

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
class Bookmarks extends Component {
  constructor(props) {
  super(props);
  this.state = {
    questions:[],
    data:[],
  };
  firebase.auth().onAuthStateChanged(this.handleUser)
  this.bookmarksRef = firebase.database().ref().child('bookmarks')

}
      handleUser = (user) => {
        if (user) {
          this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
          this.getBookmarks (user.uid)
        }
      }
      async getBookmarks (userId) {
        //Get bookmarks from db using userId
        await this.bookmarksRef.child(userId).orderByChild('type').once('value', (bookmarks)=> {
          this.data = []
        //  console.log(bookmarks.val())
        //If bookmarks are not found
         if (!bookmarks.exists()) alert('No BookMark Found!');
          //Loop through each bookmark
          bookmarks.forEach((question)=>{
            var answer = ''
            if (question.val().answer.toLowerCase() === 'a') answer = question.val().optionA
            if (question.val().answer.toLowerCase() === 'b') answer = question.val().optionB
            if (question.val().answer.toLowerCase() === 'c') answer = question.val().optionC
            if (question.val().answer.toLowerCase() === 'd') answer = question.val().optionD

            this.data.push({key:question.key, answer:answer,question:
              question.val().question})
            this.setState({questions:this.data})
          })
        })
      }

  render() {

    return (
        <MuiThemeProvider muiTheme={muiTheme} >
      <div>

        <br/>

        <div className="container">
          <div className="row">

            <div >
              {this.state.questions.map((question)=>
              <Paper  zDepth={2}
                children={<div>
               <div className="panel panel-default">
                 <div className="panel-heading">
                <p style={{ fontSize:20}}> {question.question } </p>
                 </div>
                 <div className="panel-body">
                   <div style={{fontSize:20}} >
                     <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: {question.answer}</p></div>


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

export default Bookmarks;
