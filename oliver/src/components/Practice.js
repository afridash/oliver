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

const styles = {
  radioButton: {
    marginTop: 16,
  },
};

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
    bookColor: blue300
  };
    this.timer = 0;
    this.countDown = this.countDown.bind(this);

   this.handleFocus = this.handleFocus.bind(this);
}

  handleFocus = () =>  {
    this.setState({ divColor: '#cfecf7'});
    };

    handleFocus2 = () =>  {
      this.setState({ divColor: 'white'});

      };
  changeColor = () =>  {
    this.setState({ divColor: blue300});
    };

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

        <div className="container">
          <div className="row">
            <div className="col-lg-4 ">
              <div className="panel panel-info">

                <div>
                  <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300}} zDepth={2}
                    children={<div>
                    <p style={{fontSize:20,color:'white'}}>CSC 158</p>

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
                        <Button style={style.button}>1</Button>
                        <Button style={style.button}>2</Button>
                        <Button style={style.button}>3</Button>
                        <Button style={style.button}>4</Button>
                        <Button style={style.button}>5</Button>
                        <Button style={style.button}>6</Button>
                        <Button style={style.button}>7</Button>
                        <Button style={style.button}>8</Button>
                        <Button style={style.button}>9</Button>
                        <Button style={style.button}>10</Button>
                        <Button style={style.button}>11</Button>
                        <Button style={style.button}>12</Button>
                        <Button style={style.button}>13</Button>
                        <Button style={style.button}>14</Button>
                        <Button style={style.button}>15</Button>
                        <Button style={style.button}>16</Button>
                        <Button style={style.button}>17</Button>
                        <Button style={style.button}>18</Button>
                        <Button style={style.button}>19</Button>
                        <Button style={style.button}>20</Button>

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
                    <p style={{fontSize:20,color:'white'}}>Introduction to Computer Science</p>

                  </div>
                }
                   />

                </div>

                <div className="panel-body">
                <p style={{padding:10, fontSize:20}}>

                  An electronic tool that allows information to be input, processed, and output</p>
                  <div onClick={this.handleBookMark}>
                      <BookMark  style={{color:this.state.bookColor, cursor:'pointer'}}/>
                  </div>
                          <div style={{textAlign:'center', fontSize:20}} onClick={this.changeColor}>
                            <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Operating system</p></div>
                            <div  className='panel panel-default' style={{paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Motherboard</p></div>
                            <div className='panel panel-default' style={{paddingTop:10, margin:3,  background:this.state.divColor,cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Computer</p></div>
                            <div className='panel panel-default' style={{paddingTop:10, margin:3, background:this.state.divColor,cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>CPU</p></div>

                          </div>


                          <div className="col-sm-10 col-sm-offset-1">
                            <FlatButton label="Previous" style={{position:'absolute',left:0} } />
                            <FlatButton label="Next" href="/PracticeSummary" style={{position:'absolute',right:0}}   />
                              <br/>   <br/>


                          </div>


                </div>
              </div>


              </div>
          </div>
        </div>
        <br/>

      <Paper className='hidden-sm hidden-xs' zDepth={1} style={{bottom:0, position:'absolute', width:'100%'}}>

     </Paper>


      </div>
       </MuiThemeProvider>
    );
  }
}

export default Practice;
