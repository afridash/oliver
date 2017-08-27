import React, { Component } from 'react'
import {Button, Navbar, NavItem, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import oliver from './oliver.jpg'
import './App.css'

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
        <div style={{margin:5}}>Or Maybe...View Them <Link to="/add">Here</Link></div>
        <Navbar fixedBottom justified>
          <Navbar.Header>
            <Navbar.Brand>
            <p>Powered By Afridash</p>
        </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1}><Link to="/add">Add New</Link></NavItem>
      </Nav>
    </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default App;
