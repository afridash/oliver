import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RavePaymentModal from 'react-ravepayment'
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
    color: 'pink',
  },
  underlineStyle: {
    borderColor: 'pink',
  },
  floatingLabelStyle: {
    color: 'white',
  },
  floatingLabelFocusStyle: {
    color: 'pink',
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
var currency = 'NGN'
export default class Home extends Component {
  constructor(props){
    super(props);
    this.auth = firebase.auth()
    this.state = {
      username: '',
      password: '',
      error: '',
      redirect:false,
      value:'a',
      selected:'',
      key: "FLWPUBK-860bf5069a3a8f39b69a2478c06feb3e-X",
      email: "",
      amount: 1.59,
      currency:'',
    }
    this.colleges = []
    this.picture ='https://firebasestorage.googleapis.com/v0/b/oliver-f5285.appspot.com/o/users%2Fprofile%2Fuserprofile.png?alt=media&token=e96bc455-8477-46db-a3a2-05b4a1031fe8'
    this.usersRef = firebase.database().ref().child('users')
    this.collegesRef = firebase.database().ref().child('colleges')
    firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
  }
  callback = (response) => {
    var txref = response.tx.txRef
    if (response.tx.chargeResponseCode == "00" || response.tx.chargeResponseCode == "0") {
        this.usersRef.child(this.state.userId).update({
          has_paid:true,
          paid_on:firebase.database.ServerValue.TIMESTAMP,
          payment_type:response.tx.paymentType
        }).then(()=>{
          this.setState({redirect:true})
        })
    } else {
        this.setState({paymentFailed:true})
    }
   }
  close = () => {
    console.log("Payment closed");
  }
  getReference = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";
    for( let i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  componentWillMount () {
    let url= "http://api.ipstack.com/check?access_key=38df3054d6480880d32810d7591e9a96"
    fetch(url).then((response)=>response.json()).then((responseJson)=> {
      if (responseJson.country_code == 'NG'){
        this.setState({currency:'NGN', amount:550, country:'NG', done:true})
      }else{
        this.setState({currency:'USD', amount:1.59, country:'US', done:true})
      }
    })
  }
  handleUser(user){
      if(user){
        this.setState({username:user.displayName, loggedIn:true, userId:user.uid, email:user.email})
      }
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
      this.setState({redirect:true, loading:false})
  }
  render(){
    let {amount} = this.state
    let {currency} = this.state
    return(
      <div>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='col-sm-8 col-sm-offset-2'>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            name='value'
            >
          <Tab label="Make Payment" value="a">
            <div className="col-sm-12" >
              <p>Pay your annual subscription fee of NGN 550.00 for daily access to our unlimited questions and answers.</p>
              <p>Transaction charges may apply.</p>
              {this.state.loggedIn && this.state.done && <div className='col-sm-12'>
                <RavePaymentModal
      		        text="Pay Now"
      		        class="payButton btn btn-primary"
      		        metadata={[{Subscription : 'Oliver'}]}
                  currency={currency}
      		        reference={this.getReference()}
      		        email={this.state.email}
      		        amount={amount}
      		        ravePubKey={this.state.key}
      		        callback={this.callback}
      		        close={this.close}

    	           />
              </div>}
              {this.state.paymentFailed && <p className='text-danger'>Payment was unsuccessful. Please try again later.</p>}
            </div>
            <div className='col-sm-8 col-sm-offset-2 text-center' style={{marginTop:'50%'}}>
              <img src={require('../images/rave.png')} style={{width:400, height:100}} />
            </div>
          </Tab>
        </Tabs>
        </div>
      </MuiThemeProvider>
      {this.state.redirect && <Redirect to="/dashboard" push />}
</div>
    )
  }
}
