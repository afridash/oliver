import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
const styles = {
  button:{
    float:'right',
    margin:5
  },
  box:{
      boxShadow: '5px 5px 5px #888888',
    backgroundColor:'white',
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  labelStyle: {
    color: 'white',
  },
  underlineStyle: {
    borderColor: 'white',
  },
  floatingLabelStyle: {
    color: 'white',
  },
  floatingLabelFocusStyle: {
    color: 'white',
  },
};
const muiTheme = getMuiTheme({
  tabs:{
        backgroundColor: '#2d6ca1',
      },
  inkBar: {
      backgroundColor: 'white'
  },

})
export default class Home extends Component {
  constructor(props){
    super(props);
    this.auth = firebase.auth()
    this.state = {
      username: '',
      password: '',
      colleges:[],
      error: '',
      redirect:false,
      value:'a',
      selected:'',
      email:'',
      firstName:'',
      lastName:'',
      confirmPassword:'',
      signupEmail:''
    }
    this.colleges = []
    this.picture ='https://firebasestorage.googleapis.com/v0/b/oliver-f5285.appspot.com/o/users%2Fprofile%2Fuserprofile.png?alt=media&token=e96bc455-8477-46db-a3a2-05b4a1031fe8'
    this.usersRef = firebase.database().ref().child('users')
    this.collegesRef = firebase.database().ref().child('colleges')
    firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
  }
  componentWillMount () {
    this.collegesRef.once('value', (colleges)=> {
      colleges.forEach((college)=> {
        this.colleges.push({
          key:college.key,
          name:college.val().college,
          location:college.val().location
        })
        this.setState({colleges:this.colleges})
      })
    })
  }
  componentDidMount () {
    this.usersRef.once('value', (users)=> {
      users.forEach((user)=> {
        user.ref.update({displayName: user.val().firstName + ' ' + user.val().lastName})
      })
    })
  }
  handleUser(user){
      if(user){
        this.setState({username:user.displayName, loggedIn:true})
        localStorage.setItem('userId', user.uid)
      }
    }
  async handleLogin (event) {
    this.setState({loading:true})
      event.preventDefault()
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
        this.usersRef.child(user.uid).once('value', (student)=>{
          localStorage.setItem('collegeId', student.val().collegeId)
          localStorage.setItem('userId', user.uid)
          if (student.hasChild('has_paid') && student.val().has_paid === true) {
            this.setState({redirect:true, loading:false})
          }else{
            localStorage.setItem('has_paid', "false")
            this.setState({notPaid:true, loading:false})
          }
        })
      }).catch((error)=> {
      var errorMessage = error.message
      this.setState({error:errorMessage, loading:false})
    })
  }
  handlePasswordChange (event){
    this.setState({password: event.target.value})
  }
  handleTextChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  handleChange = (value) => {
    this.setState({
      value: value,
    });
  }
  handleSelect = (event, index, value) => {
    this.setState({selected:value, selectedIndex:index})
  }
  handleSignUp (event) {
    this.setState({loading:true})
    event.preventDefault()
    if (this.state.firstName !== '' && this.state.lastName !== '' && this.state.username !== '' && this.state.selected !== '' && this.state.signupEmail !=='') {
      var username = this.state.username
      if (this.state.password === this.state.confirmPassword) {
        firebase.auth().createUserWithEmailAndPassword(this.state.signupEmail, this.state.password).then((user)=> {
          this.setUser(user, username)
        }).catch((error)=> {
          var errorCode = error.code;
          var errorMessage = error.message
          this.setState({signUpError:errorMessage, loading:false})
        })
      }else {
        this.setState({signUpError:'Passwords do not match', loading:false})
      }
    }else{
      this.setState({signUpError:'Data fields must be completed', loading:false})
    }

  }
  setUser (user, username) {
       user.updateProfile({
        displayName: this.state.firstName + " "+this.state.lastName,
        photoURL:this.picture
      }).then(()=> {
        user.sendEmailVerification().then(()=> {
          this.saveUserInfo(user.uid, username)
        }).catch((error)=> {
              this.setState({signUpError:error.message, loading:false})
          })
      }, (error)=> {
        this.setState({signUpError:error.message, loading:false})
      })
  }
  saveUserInfo(userKey, username){
    var college = this.state.colleges[this.state.selectedIndex-1]
    this.usersRef.child(userKey).set({
      firstName: this.state.firstName,
      lastName:this.state.lastName,
      email: this.state.signupEmail,
      username:username,
      displayName:this.state.firstName + ' ' + this.state.lastName,
      userKey:userKey,
      profilePicture:this.picture,
      collegeId:college.key,
      college:college.name,
      signup_method:'web',
      signed_up:firebase.database.ServerValue.TIMESTAMP
      })
      localStorage.setItem('collegeId', college.key)
      localStorage.setItem('userId', userKey)
      localStorage.setItem('has_paid', "false")
      this.setState({notPaid:true, loading:false})
  }
  logOut () {
    firebase.auth().signOut().then(()=> {
      this.setState({loggedIn:false})
    })
  }
  render() {
    return (
       <div>
        <section className="header parallax home-parallax page" id="HOME">
        <div className="section_overlay">
          <nav className="navbar navbar-default navbar-fixed-top">
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
                          {this.state.loggedIn ? <li><Link to="/dashboard"> DASHBOARD </Link> </li> : <li><a href="Login"> LOGIN</a> </li>}
                          {this.state.loggedIn && <li><a href='#' onClick={()=>this.logOut()}>LOG OUT </a> </li>}
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
                          <p style={{fontSize:18, color:'#ff1744', marginTop:30}} className='text-danger'>Now NGN 550.00 Per Year for a limited time</p>
                          <div className="download-btn">
                              <a className="btn home-btn wow fadeInLeft" href="#DOWNLOAD">Download</a>
                              <a className="tuor btn wow fadeInRight" href="#ABOUT">Take a tour <i className="fa fa-angle-down"></i></a>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <MuiThemeProvider muiTheme={muiTheme}>
                      <div className='col-sm-12'>
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          name='value'
                          >
                            <Tab label="LOGIN" value="a">
                              <div>
                                <div className="col-sm-12" >
                                  <h3 style={styles.labelStyle} className='text-center'>Login</h3>
                                  <form>
                                    <TextField
                                      hintText="Enter Email"
                                      fullWidth={true}
                                      name='email'
                                      floatingLabelText="Email"
                                      hintStyle={styles.labelStyle}
                                      floatingLabelStyle={styles.floatingLabelStyle}
                                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                      underlineStyle={styles.underlineStyle}
                                      className='text-center'
                                      onChange = {this.handleTextChange}
                                      inputStyle={{color:'white'}}
                                    />
                                    <TextField
                                      type="password"
                                      fullWidth={true}
                                      name='password'
                                      hintText="Enter Password"
                                      floatingLabelText="Password"
                                      className='text-center'
                                      hintStyle={styles.labelStyle}
                                      floatingLabelStyle={styles.floatingLabelStyle}
                                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                      underlineStyle={styles.underlineStyle}
                                      inputStyle={{color:'white'}}
                                      onChange = {this.handleTextChange}
                                    />
                                    <p style={{color:'red'}}>{this.state.error}</p>
                                    <br />
                                    <div className='col-sm-12'>
                                      {this.state.loading ? <RaisedButton labelStyle={{color:'white'}} buttonStyle={{backgroundColor:'#2d6ca1'}} label="Logging In..." style={styles.button}
                                        />: <RaisedButton type="submit" labelStyle={{color:'white'}} buttonStyle={{backgroundColor:'#2d6ca1'}} label="Login" style={styles.button} onClick={(event) =>
                                          this.handleLogin(event)}/>}
                                          {this.state.loggedIn && <Link to='/dashboard'><RaisedButton labelStyle={{color:'white'}} buttonStyle={{backgroundColor:'#388E3C', borderColor:'white'}} label={"Continue as " + this.state.username} style={styles.button} /></Link>}
                                    </div>
                                    </form>
                                </div>
                              </div>
                            </Tab>
                            <Tab label="CREATE ACCOUNT" value="b">
                              <div className="col-sm-12" >
                                <h3 style={{color:'white'}} className='text-center'>Sign Up</h3>
                                <form>
                                  <TextField
                                    hintText="First Name"
                                    floatingLabelText="First Name"
                                    className='text-center'
                                    name='firstName'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <TextField
                                    hintText="Last Name"
                                    name='lastName'
                                    floatingLabelText="Last Name"
                                    className='text-center'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <TextField
                                    hintText="Enter Email"
                                    name='signupEmail'
                                    floatingLabelText="Email"
                                    className='text-center'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <TextField
                                    type="password"
                                    fullWidth={true}
                                    name='password'
                                    hintText="Enter Password"
                                    floatingLabelText="Password"
                                    className='text-center'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <TextField
                                    type="password"
                                    fullWidth={true}
                                    name='confirmPassword'
                                    hintText="Enter Password"
                                    floatingLabelText="Confirm Password"
                                    className='text-center'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <TextField
                                    hintText="Enter Username"
                                    name='username'
                                    floatingLabelText="Username"
                                    className='text-center'
                                    hintStyle={styles.labelStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    inputStyle={{color:'white'}}
                                    onChange = {this.handleTextChange}
                                  />
                                  <SelectField
                                    value={this.state.selected}
                                    onChange={this.handleSelect}
                                    labelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    name='selected'
                                    maxHeight={200}
                                    >
                                      <MenuItem value=''  primaryText={'Choose University'} />
                                      {this.state.colleges.map((college, i)=>
                                      <MenuItem value={college.name} key={i} primaryText={college.name} />
                                    )}
                                    </SelectField>
                                  <p style={{color:'red'}}>{this.state.signUpError}</p>
                                  <br />
                                  <div className='col-sm-12'>
                                    {this.state.loading ? <RaisedButton labelStyle={{color:'white'}} buttonStyle={{backgroundColor:'#2d6ca1'}} label="Signing up..." style={styles.button}/> :
                                      <RaisedButton type="submit" labelStyle={{color:'white'}} buttonStyle={{backgroundColor:'#2d6ca1'}} label="Sign up" style={styles.button} onClick={(event) =>
                                        this.handleSignUp(event)}/>}
                                  </div>
                                  </form>
                              </div>
                            </Tab>
                          </Tabs>
                      </div>
                    </MuiThemeProvider>
                  </div>
              </div>
          </div>
      </div>
      </section>
      {this.state.redirect && <Redirect to='/dashboard' push />}
      {this.state.notPaid && <Redirect to='/pay' push />}
    </div>
    )
  }
}
