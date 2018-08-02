import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

export default class Login extends Component {
  constructor(props){
    super(props);
    this.auth = firebase.auth()
    this.state = {
      username: '',
      password: '',
      error: '',
      redirect:false,
    }
    this.adminsRef = firebase.database().ref().child('admins')
  }

  handleUser(user){
      if(user){
        this.setState({redirect:true})
        localStorage.setItem('userId', user.uid)
      }
    }

  async handleSubmit (event) {
    event.preventDefault()
    this.setState({loading:true})
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=> {
      this.adminsRef.child(user.uid).once('value',(admin)=>{
        if (admin.exists()){
          this.setState({successful:true, loading:false})
          localStorage.setItem('admin', 'true')
        }else{
          alert("An error occurred during your login, returning you to login")
          this.setState({redirect:true, loading:false})
        }
      })
    }).catch((error)=> {
    var errorMessage = error.message;
    this.setState({error:errorMessage, loading:false})
  })
  }

  handleChange = (event) => {
  this.setState({[event.target.name]: event.target.value})
  }

  render () {
    return (
      <div className='center'>
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
                  <p className='text-info'>Log in to your admin dashboard using assigned credentials</p>
                  <form>
              <TextField
                name="email"
                hintText="Enter Your Email"
                floatingLabelText="Email"
                onChange={this.handleChange}
              />
              <br/>
              <TextField
                type="password"
                name="password"
                hintText="Enter Your Password"
                floatingLabelText="Password"
                onChange = {this.handleChange}
              />
              <br/>
              <p style={{color:'red'}}>{this.state.error}</p>
              {this.state.loading ?   <RaisedButton type="submit" label="Loading..." primary={true} style={styles.button}/>:   <RaisedButton type="submit" label="Submit" primary={true} style={styles.button} onClick={(event) =>
                this.handleSubmit(event)}/>}
                <p className='text-danger'>Contact your admin if you forget your account details. Email support@afridash.com</p>
              </form>
                </div>
            </div>
            </div>
          </MuiThemeProvider>
          {this.state.successful && <Redirect to='/in-house/home' push />}
          {this.state.redirect && <Redirect to='/login' push />}
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
