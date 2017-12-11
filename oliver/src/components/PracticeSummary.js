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
class PracticeSummary extends Component {
  constructor(props) {
  super(props);
  this.state = {

  };

}

  render() {

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
            <div className="col-lg-4">
              <div className="panel panel-default">
                <div>
                  <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300}} zDepth={2}
                    children={<div>
                    <p style={{fontSize:30,color:'white'}}>Result</p>

                  </div>
                }/>
                </div>
              <h3 style={{fontSize:30, padding:40}}> Score: 10/20 (50%)</h3>
              <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                  <RaisedButton label="Another One !" backgroundColor={blue300} labelColor={'white'} fullWidth={true}  style={{margin: 4,
                  backgroundColor:'#cfecf7',}} />
                  </div>

                    <div className="col-sm-10 col-sm-offset-1">
                  <div className="row">
                    <div className="col-sm-6">
                    <Link to='/apphome' style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary"> RETURN HOME </Link>
                  </div>

                    <div className="col-sm-6">

                    <button style={{padding:8,borderWidth:0, background:blue300, margin:4,width:'100%'}} type="button" className="btn btn-primary">
                      SHARE</button>

                      </div>

              </div>

                  </div>

                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <Paper  zDepth={2}
                children={<div>
               <div className="panel panel-default">
                 <div className="panel-heading">
                <p style={{ fontSize:20}}> 1.  An electronic tool that allows information to be input, processed, and output </p>
                 </div>
                 <div className="panel-body">
                   <div style={{fontSize:20}} >
                     <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: Operating system</p></div>
                     <div  className='panel panel-default' style={{borderColor:'red',paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: Motherboard</p></div>


                   </div>
                 </div>
               </div>
             </div>
           }/>
              <Paper  zDepth={2}
                children={<div>
               <div className="panel panel-default">
                 <div className="panel-heading" style={{background:'#F5F5F5'}}>
                <p style={{ fontSize:20}}> 2.  An electronic tool that allows information to be input, processed, and output </p>
                 </div>
                 <div className="panel-body">
                   <div style={{fontSize:20}} >
                     <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: Operating system</p></div>
                     <div  className='panel panel-default' style={{paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: Operating system</p></div>


                   </div>
                 </div>
               </div>
             </div>
           }/>
           <Paper  zDepth={2}
             children={<div>
            <div className="panel panel-default">
              <div className="panel-heading">
             <p style={{ fontSize:20}}>3. An electronic tool that allows information to be input, processed, and output An electronic tool that allows information to be input, processed, and output An electronic tool that allows information to be input, processed, and output </p>
              </div>
              <div className="panel-body">
                <div style={{fontSize:20}} >
                  <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: Operating system</p></div>
                  <div  className='panel panel-default' style={{borderColor:'red',paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: Motherboard</p></div>


                </div>
              </div>
            </div>
          </div>
        }/>
            </div>
          </div>
        </div>



      </div>
       </MuiThemeProvider>
    );
  }
}

export default PracticeSummary;
