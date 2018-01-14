import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import BookMark from 'material-ui/svg-icons/action/bookmark';
import Restore from 'material-ui/svg-icons/action/restore';
import Dialog from 'material-ui/Dialog';
import {Nav, Navbar, NavDropdown, Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
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


      showSummary () {
      return (
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
              <h3 style={{fontSize:30, padding:40}}> Score: {this.state.correct}/{this.state.questions.length} ({this.state.percentage})</h3>
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
            {this.state.questions.map((question)=>
            <div className="col-lg-8">
              <Paper  zDepth={2}
                children={<div>
               <div className="panel panel-default">
                 <div className="panel-heading">
                <p style={{ fontSize:20}}> {question.question} </p>
                 </div>
                 <div className="panel-body">
                   <div style={{fontSize:20}} >
                     <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor, cursor:'pointer'}} onMouseEnter={this.handleFocus}  onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Correct Answer: {question.answer} </p></div>
                     <div  className='panel panel-default' style={{borderColor:'red',paddingTop:10, margin:3,background:this.state.divColor,  cursor:'pointer'}} onMouseEnter={this.handleFocus} onMouseLeave={this.handleFocus2}><p style={{fontSize:20}}>Selected Answer: {question.selected} </p></div>


                   </div>
                 </div>
               </div>
             </div>
           }/>

            </div>
             )}
          </div>
        </div>
      )
      }
  render() {

    return (
        <MuiThemeProvider muiTheme={muiTheme} >
      <div>

        <br/>
        {
          (()=>{
          if (this.state.isloading){
            return this.spinner()
          }
          else {
            return this.showSummary()
          }
        })()
      }

      </div>
       </MuiThemeProvider>
    );
  }
}

export default PracticeSummary;
