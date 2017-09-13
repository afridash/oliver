import React, { Component } from 'react'
import {Button, Navbar, NavItem, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import oliver from './oliver.jpg'
import './AppStyles.css'
import {Firebase} from './auth/firebase'
const firebase =  require('firebase')
class App extends Component {
  constructor (props){
    super (props)
    this.state ={
      questions:"We are counting..."
    }
    this.ref = firebase.database().ref().child('questions')
    this.celRef = firebase.database().ref().child('celebration')
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
    this.celRef.once('value', (cel)=>{
      this.setState(cel.val())
    })
  }
  showConfetti () {
    return (
      <div>
        <div className="confetti confetti1"></div>
        <div className="confetti confetti2"></div>
        <div className="confetti confetti3"></div>
        <div className="confetti confetti4"></div>
        <div className="confetti confetti5"></div>
        <div className="confetti confetti6"></div>
        <div className="confetti confetti7"></div>
        <div className="confetti confetti8"></div>
        <div className="confetti confetti9"></div>
        <div className="confetti confetti10"></div>
        <div className="confetti confetti11"></div>
        <div className="confetti confetti12"></div>
        <div className="confetti confetti13"></div>
        <div className="confetti confetti14"></div>
        <div className="confetti confetti15"></div>
        <div className="confetti confetti16"></div>
        <div className="confetti confetti17"></div>
        <div className="confetti confetti18"></div>
        <div className="confetti confetti19"></div>
        <div className="confetti confetti20"></div>
        <div className="confetti confetti21"></div>
        <div className="confetti confetti1"></div>
        <div className="confetti confetti2"></div>
        <div className="confetti confetti3"></div>
        <div className="confetti confetti4"></div>
        <div className="confetti confetti5"></div>
        <div className="confetti confetti6"></div>
        <div className="confetti confetti7"></div>
        <div className="confetti confetti8"></div>
        <div className="confetti confetti9"></div>
        <div className="confetti confetti10"></div>
        <div className="confetti confetti11"></div>
        <div className="confetti confetti12"></div>
        <div className="confetti confetti13"></div>
        <div className="confetti confetti14"></div>
        <div className="confetti confetti15"></div>
        <div className="confetti confetti16"></div>
        <div className="confetti confetti17"></div>
        <div className="confetti confetti18"></div>
        <div className="confetti confetti19"></div>
        <div className="confetti confetti20"></div>
        <div className="confetti confetti21"></div>

        <div className="confetti confetti22"></div>
        <div className="confetti confetti23"></div>
        <div className="confetti confetti24"></div>
        <div className="confetti confetti25"></div>
        <div className="confetti confetti26"></div>
        <div className="confetti confetti27"></div>
        <div className="confetti confetti28"></div>
        <div className="confetti confetti29"></div>
        <div className="confetti confetti30"></div>
        <div className="confetti confetti31"></div>
        <div className="confetti confetti32"></div>
        <div className="confetti confetti33"></div>
        <div className="confetti confetti34"></div>
        <div className="confetti confetti35"></div>
        <div className="confetti confetti36"></div>
        <div className="confetti confetti37"></div>
        <div className="confetti confetti38"></div>
        <div className="confetti confetti39"></div>
        <div className="confetti confetti40"></div>
        <div className="confetti confetti41"></div>
        <div className="confetti confetti22"></div>
        <div className="confetti confetti23"></div>
        <div className="confetti confetti24"></div>
        <div className="confetti confetti25"></div>
        <div className="confetti confetti26"></div>
        <div className="confetti confetti27"></div>
        <div className="confetti confetti28"></div>
        <div className="confetti confetti29"></div>
        <div className="confetti confetti30"></div>
        <div className="confetti confetti31"></div>
        <div className="confetti confetti32"></div>
        <div className="confetti confetti33"></div>
        <div className="confetti confetti34"></div>
        <div className="confetti confetti35"></div>
        <div className="confetti confetti36"></div>
        <div className="confetti confetti37"></div>
        <div className="confetti confetti38"></div>
        <div className="confetti confetti39"></div>
        <div className="confetti confetti40"></div>
        <div className="confetti confetti41"></div>
      </div>
    )
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
        <div style={{marginTop:'10%'}}><h3 className='text-danger'>Our Questions so Far: <Link to='/stats'>{this.state.questions}</Link></h3></div>
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
        {this.state.questions > this.state.start && this.state.questions < this.state.end && this.showConfetti()}
      </div>
    );
  }
}

export default App;
