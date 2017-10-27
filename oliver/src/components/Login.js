import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Link,Redirect, } from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

class Login extends Component {
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
    var errorMessage = error.message;
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
          <MuiThemeProvider>
            <div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>

              <div className="row" >
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
              <RaisedButton label="Submit" primary={true} style={styles.button} onClick={(event) =>
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
  boxShadow: '10px 10px 5px #888888',
},
};
export default Login;
