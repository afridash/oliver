import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import { Link, Redirect } from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

export default class Home extends Component {

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
      }
    }

  async handleSubmit (event) {
      event.preventDefault()
      var loggedInError = false
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
        this.setState({redirect:true})
      }).catch((error)=> {
      var errorCode = error.code;
      var errorMessage = error.message
      this.setState({error:errorMessage})
      loggedInError=true
    })
  }

  handlePasswordChange (event){
    this.setState({password: event.target.value})
  }

  handleEmailChange (event) {
    this.setState({email: event.target.value})
  }

  render() {
    return (
  this.state.redirect ? <Redirect to='/AppHome' push/> : <div>
    <section className="header parallax home-parallax page" id="HOME">
      <h2></h2>
      <div className="section_overlay">
          <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
              <div className="container">
                  <div className="navbar-header">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="#">
                          <img src="images/logo.png" alt="Logo" />
                      </a>
                  </div>
                  <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav navbar-right">
                          <li><a href="#HOME">HOME</a> </li>
                          <li><a href="#ABOUT">ABOUT </a> </li>
                          <li><a href="#FEATURES">FEATURES</a></li>
                          <li><a href="#SCREENS">SCREENS</a> </li>
                          <li><a href="#DOWNLOAD">DOWNLOAD </a> </li>
                          <li><a href="#SUSCRIBE">CONTACT </a> </li>
                          <li><a href="Login">LOGIN </a> </li>
                      </ul>
                  </div>
              </div>
          </nav>

          <div className="container home-container">
              <div className="row">
                  <div className="col-md-8 col-sm-8">
                      <div className="home_text">
                          <h1>Oliver</h1>
                          <p>Exam Prep Simplified</p>

                          <div className="download-btn">
                              <a className="btn home-btn wow fadeInLeft" href="#DOWNLOAD">Download</a>
                              <a className="tuor btn wow fadeInRight" href="#ABOUT">Take a tour <i className="fa fa-angle-down"></i></a>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                            <form>
                              <div className='well'>
                                <div className="row">
                                  <div className="col-md-10 col-md-offset-1">
                                <h3 className='text-center'>Login</h3>
                                    <br/>
                            <FormGroup bsSize="large">
                              <ControlLabel>Email Address</ControlLabel>
                              <FormControl
                                className='form-control'
                                placeholder="Enter Your Email"
                                onChange = {this.handleEmailChange.bind(this)}
                              />
                            </FormGroup>

                            <br/>
                          <FormGroup bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                              className='form-control'
                              type="password"
                              placeholder="Enter Your Password"
                              onChange = {this.handlePasswordChange.bind(this)}
                            />
                          </FormGroup>

                            <br/>
                            <p style={{color:'red'}}>{this.state.error}</p>
                            <FormGroup>
                              <Button type="submit" bsStyle="primary" bsSize="large" style={styles.button} onClick={(event) =>
                              this.handleSubmit(event)} >Login</Button>
                            </FormGroup>
                            <div className="col-md-8 col-md-offset-2"><a target="_blank" href={'https://oliver.afridash.com/policy'}>Privacy Policy</a></div>
                            </div>
                          </div>
                        </div>
                            </form>
                  </div>

              </div>
          </div>
      </div>
  </section>
  </div>
);
}
}
const styles = {
button:{
  width:'100%'
},
box:{
  boxShadow: '5px 5px 5px #888888',
  backgroundColor:'#E0E0E0',
  top:'30%',
},
};
