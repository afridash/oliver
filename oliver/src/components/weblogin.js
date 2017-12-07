import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
import Image from 'material-ui-image'
import Nsukka from './Nsukka.jpg'
import { Link,Redirect, } from 'react-router-dom'
import {Firebase} from '../auth/firebase'

const firebase =  require('firebase')

class Weblogin extends Component {

  constructor(props){
    super(props);
    this.auth = firebase.auth()
    this.state = {
      username: '',
      password: '',
      error: '',
      redirect:false,
    }
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(this.handleUser)
  }

  handleUser(user){
      if(user){
        this.setState({redirect:true})
      }
    }

  async handleSubmit (event) {
      event.preventDefault()
      var loggedInError = false
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message
      console.log(errorMessage)
      alert(errorMessage)
      loggedInError=true
    })
      if(!loggedInError){
        this.setState({redirect:true})
      }else{
        this.setState({error:"Password and Email Do Not Match"})
      }
  }

  handlePasswordChange (event){
    this.setState({password: event.target.value})
  }
  handleEmailChange (event) {
    this.setState({email: event.target.value})
  }

  render () {
  return (
    this.state.redirect ? <Redirect to='/students' push/> : <div className='center'>
          <MuiThemeProvider >
            <div>
              <Paper zDepth={2}>
            <AppBar
              style={{backgroundColor:'#0D47A1'}}
            showMenuIconButton={false}/>
            </Paper>

            <img src={require('./Nsukka.jpg')} style={{height:'100%', width:'100%', }} />
              <div className="row" style={{position:'absolute', top:'7%', width:'100%', backgroundColor:'rgba(0,0,0,0.5)', height:'100%'}}>
                <div className="col-md-4 col-md-offset-4" style={styles.box}>
                  <h3 className='text-center'>Login</h3>
              <TextField
                hintText="Enter Your Username or Email"
                floatingLabelText="Username"
                onChange = {this.handleEmailChange.bind(this)}
              />
              <br/>
              <TextField
                type="password"
                hintText="Enter Your Password"
                floatingLabelText="Password"
                onChange = {this.handlePasswordChange.bind(this)}
              />
              <br/>
              <p style={{color:'red'}}>{this.state.error}</p>
              <RaisedButton type="submit" label="Submit" backgroundColor='#0D47A1' style={styles.button} onClick={(event) =>
              this.handleSubmit(event)}/>
                </div>
              </div>
       </div>
          </MuiThemeProvider>
        </div>

  );
}
}
const styles = {
button:{margin: 15},
box:{
  boxShadow: '5px 5px 5px #888888',
  backgroundColor:'#FBE9E7',
  top:'30%',
},
};
export default Weblogin;
