import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './App.css';
const firebase =  require('firebase')
class Students extends Component {
  constructor (props) {
    super (props)
    this.state ={
      colleges:[]
    }
    this.collegeRef = firebase.database().ref().child('colleges')

  }
 componentDidMount () {
    this.collegeRef.once('value', (snapshots)=>{
      this.colleges = []
      snapshots.forEach((snapshot)=>{
        this.colleges.push(snapshot.val())
        this.setState({colleges:this.colleges})
      })
    })

  }

  render() {
    return (

      <div className="Students">
      
        <header className="App-header">
          <h1 className="App-title">FYE class Analytics</h1>

        </header>
       
        
      <div className="container">
<br/>
      <div className="col-sm-8 col-sm-offset-2">

        <table className="table table-striped table-bordered bootstrap-datatable datatable">
  <thead>
    <tr>
      <th scope="col">#</th>
   
      <th scope="col">Student's Name</th>
      <th scope="col">Number of Tests Taken</th>
      <th scope="col">Last Login</th>
      <th scope="col">Number of completed Tests</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <th scope="row">1</th>

      <td> <Link to="/student"> Mark Otto </Link> </td>

      <td>-</td>
      <td>an hour ago</td>
      <td> 5 </td>
    </tr>
    <tr>
      <th scope="row">2</th>
     
       <td> <Link to="/student/{user.key}">Jacob Thornton </Link> </td>
      <td>-</td>
      <td>an hour ago</td>
       <td> 10 </td>
    </tr>
    <tr>
      <th scope="row">3</th>
     
       <td> <Link to="/student/{user.key}"> Larry the Bird </Link> </td>
      <td>-</td>
      <td>an hour ago</td>
       <td> 15 </td>
    </tr>
  </tbody>
</table>

      </div>
      </div>

      </div>
    );
  }
}

export default Students;
