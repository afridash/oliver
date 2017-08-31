import React, { Component } from 'react'
import {Button, Navbar, NavItem, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import oliver from './oliver.jpg'
import './App.css'
import {Firebase} from './auth/firebase'
const firebase =  require('firebase')
class App extends Component {
  constructor (props){
    super (props)
    this.state ={
      questions:"We are counting..."
    }
    this.ref = firebase.database().ref().child('questions')
  }
  async componentWillMount (){
    this.totalQuestions = 0
       this.ref.once('value', (snapshots)=>{
      snapshots.forEach((Datasnapshots)=>{
        Datasnapshots.forEach((data)=>{
          this.totalQuestions += 1
          this.setState({questions:this.totalQuestions})
        })
      })
    })
  }
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
        <Link to="/questions"><Button bsStyle="primary" bsSize="large">Add Questions</Button></Link>
        <div style={{margin:5}}>Or Maybe...View Them <Link to="/view">Here</Link></div>
        <div style={{marginTop:'10%'}}><h3 className='text-info'>Our Questions so Far: {this.state.questions}</h3></div>
        <Navbar fixedBottom >
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
