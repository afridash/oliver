import React, { Component } from 'react'
import {Button, Navbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import oliver from './oliver.jpg'
import logo from './logo.png'
import './App.css'
import {Firebase} from './auth/firebase'
const firebase =  require('firebase')

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={oliver} className="App-logo" alt="Oliver" />
          <h2>Welcome to Oliver</h2>
        </div>
        <p className="App-intro">
          Please sir, can I have some more questions ? :(
        </p>
        <Button bsStyle="primary" bsSize="large">Add Questions</Button>
        <div style={{margin:5}}>Or Maybe...View Them <Link to="/">Here</Link></div>
        <Navbar fixedBottom justified>
          <Navbar.Header>
            <Navbar.Brand>
            <p>Powered By Afridash</p>
        </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default App;
