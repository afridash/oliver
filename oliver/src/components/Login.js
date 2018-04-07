import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
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
    firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
  }

  handleUser(user){
      if(user){
        this.setState({redirect:true})
        localStorage.setItem('userId', user.uid)
      }
    }

  async handleSubmit (event) {
    event.preventDefault()
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=> {
      localStorage.setItem('userId', user.uid)
        this.setState({redirect:true})
    }).catch((error)=> {
    var errorMessage = error.message;
    this.setState({error:errorMessage})
  })
  }
  handlePasswordChange (event){
    this.setState({password: event.target.value})
  }

  handleEmailChange (event) {
  this.setState({email: event.target.value})
  }

  render () {
  return (
    this.state.redirect ? <Redirect to='/dashboard' push/> : <div className='center'>
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
                  <form>
              <TextField
                hintText="Enter Your Email"
                floatingLabelText="Email"
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
              <RaisedButton type="submit" label="Submit" primary={true} style={styles.button} onClick={(event) =>
              this.handleSubmit(event)}/>
              </form>
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
