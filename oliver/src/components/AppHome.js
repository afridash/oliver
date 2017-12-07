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

import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';

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
  };
}

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };

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
        <MuiThemeProvider muiTheme={muiTheme} >
      <div>

        <AppBar
          iconElementLeft={<Avatar
            src="images/oliverLogo.png"
            size={45}
            style={{backgroundColor:"#2d6ca1"}}
          />}
          children={
            <div>

              <FlatButton label="Activities" style={{color:'white'}}/>
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
                  style={{marginBottom:10,cursor:'pointer'}}
                  label='Jane Doe'
                  //onMouseEnter={this.handleOpenMenu}
                  //onMouseLeave={this.handleCloseMenu}
                  onClick={this.handleOpenMenu}
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
                <MenuItem value="3" primaryText="Sign out" />

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
          <div className="col-lg-3">
            <Paper style={style.paper} zDepth={2} rounded={true}
              children={<div>
                <div className="row">
                  <div className='col-sm-4'>
                    <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                      <div className="panel-heading"> CSC 158 </div>
                      <div className="panel-body">
                        <p>HIGH SCORE</p>
                        <p> 50% </p> </div>

                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div>
                      <Paper style={style} zDepth={2}
                        children={<div>
                        <p>Introduction to Computer Science</p>

                      </div>
                    }
                       />

                    </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1">
                          <RaisedButton label="Study Theory" fullWidth={true} style={style.chip} />
                          <RaisedButton label="Study Objective" fullWidth={true} style={style.chip} />
                          <RaisedButton label="Practice" fullWidth={true} onClick={this.handleOpen} style={style.chip}/>
                              <Dialog
                                title="Introduction to Computer Science"
                                actions={actions}
                                modal={false}
                                open={this.state.open}
                                onRequestClose={this.handleClose}
                                autoScrollBodyContent={true}
                              >
                              1.  An electronic tool that allows information to be input, processed, and output
                                <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                                  {radios}
                                </RadioButtonGroup>

                                2.  An electronic tool that allows information to be input, processed, and output
                                  <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                                    {radios}
                                  </RadioButtonGroup>

                                3.  An electronic tool that allows information to be input, processed, and output
                                  <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                                    {radios}
                                  </RadioButtonGroup>

                                4.  An electronic tool that allows information to be input, processed, and output
                                  <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                                    {radios}
                                  </RadioButtonGroup>
                              </Dialog>

                        </div>
                      </div>
                  </div>
                </div>
              </div>
              }
        />
          </div>

          <div className="col-lg-3">
            <Paper style={style.paper} zDepth={2} rounded={true}
              children={<div>
                <div className="row">
                  <div className='col-sm-4'>
                    <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                      <div className="panel-heading"> CSC 158 </div>
                      <div className="panel-body">
                        <p>HIGH SCORE</p>
                        <p> 50% </p> </div>

                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div>
                      <Paper style={style} zDepth={2}
                        children={<div>
                        <p>Introduction to Computer Science</p>

                      </div>
                    }
                       />

                    </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1">
                          <Paper style={style} zDepth={2}
                            children={<div>

                                Study Theory

                          </div>
                        }
                           />

                           <Paper zDepth={2}
                             children={<div>

                                Study Objective

                           </div>
                         }
                            />

                            <Paper style={style} zDepth={2}
                              children={<div>

                                Practice

                            </div>
                          }
                             />

                    
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              }
        />
          </div>

          <div className="col-lg-3">
            <Paper style={style.paper} zDepth={2} rounded={true}
              children={<div>
                <div className="row">
                  <div className='col-sm-4'>
                    <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                      <div className="panel-heading"> CSC 158 </div>
                      <div className="panel-body">
                        <p>HIGH SCORE</p>
                        <p> 50% </p> </div>

                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div>
                      <Paper style={style} zDepth={2}
                        children={<div>
                        <p>Introduction to Computer Science</p>

                      </div>
                    }
                       />

                    </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1">
                    <Chip
                      style={style.chip}
                    >
                      Study Theory
                    </Chip>

                    <Chip
                      style={style.chip}
                    >
                      Study Objective
                    </Chip>

                    <Chip
                      style={style.chip}
                    >
                      Practice
                    </Chip>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              }
        />
          </div>

          <div className="col-lg-3">
            <Paper style={style.paper} zDepth={2} rounded={true}
              children={<div>
                <div className="row">
                  <div className='col-sm-4'>
                    <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                      <div className="panel-heading"> CSC 158 </div>
                      <div className="panel-body">
                        <p>HIGH SCORE</p>
                        <p> 50% </p> </div>

                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div>
                      <Paper style={style} zDepth={2}
                        children={<div>
                        <p>Introduction to Computer Science</p>

                      </div>
                    }
                       />

                    </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1">
                    <Chip
                      style={style.chip}
                    >
                      Study Theory
                    </Chip>

                    <Chip
                      style={style.chip}
                    >
                      Study Objective
                    </Chip>

                    <Chip
                      style={style.chip}
                    >
                      Practice
                    </Chip>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              }
        />
          </div>

            </div>



      </div>
       </MuiThemeProvider>
    );
  }
}

export default AppHome;
