import React, {Component} from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap"
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
            <div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>

              <div className="row" >
                <form>
                  <div className="col-md-4 col-md-offset-4" style={styles.box}>
                    <h3 className='text-center'>Login</h3>
                        <br/>
                <FormGroup bsSize="large">
                  <ControlLabel>Email Address</ControlLabel>
                  <FormControl
                    className='form-control'
                    placeholder="Please Enter Your Email"
                    onChange = {this.handleEmailChange.bind(this)}
                  />
                </FormGroup>

                <br/>
              <FormGroup bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  className='form-control'
                  type="password"
                  placeholder="Please Enter Your Password"
                  onChange = {this.handlePasswordChange.bind(this)}
                />
              </FormGroup>

                <p style={{color:'red'}}>{this.state.error}</p>
                <FormGroup>
                  <Button type="submit" bsStyle="primary" bsSize="large" style={styles.button} onClick={(event) =>
                  this.handleSubmit(event)} >Login</Button>
                </FormGroup>
                  </div>
                </form>
            </div>
            </div>
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