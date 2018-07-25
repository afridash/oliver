import React, { Component } from 'react'
import {Button, Navbar, NavItem, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import oliver from './oliver.jpg'
import './App.css'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export default class Home extends Component {
  constructor (props){
    super (props)
    this.state ={
      questions:"We are counting...",
      emails:[]
    }
    this.ref = firebase.database().ref().child('users')
    this.emails = []
  }
  async componentWillMount (){
    this.ref.once('value', (users)=>{
      users.forEach((user)=>{
        this.emails.push({email:user.val().email})
      })
      this.setState({emails:this.emails})
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={oliver} className="App-logo" alt="Oliver" />
          <h2>Welcome to Oliver</h2>
        </div>
          {this.state.emails.map((mail, k)=>
            <p>{mail.email}</p>
          )}
        <Navbar fixedBottom >
          <Navbar.Header>
            <Navbar.Brand>
            <p>Powered By Afridash</p>
        </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
    </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
