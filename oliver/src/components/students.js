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
      students:[],
      courses:[],
      userId:'',
      username:'',
    }
    firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
    this.studentsRef = firebase.database().ref().child('user_courses')
    this.registeredRef = firebase.database().ref().child('registered_courses')
  }
  handleUser (user) {
    if (user){
      this.setState({userId:user.uid, username:user.displayName})
      this.loadCourses()
    }
  }
 loadCourses () {
    this.studentsRef.child(this.state.userId).once('value', (snapshots)=>{
      this.courses = []
      snapshots.forEach((snapshot)=>{
        this.getStudents(snapshot.key)
        this.courses.push(snapshot.val())
        this.setState({courses:this.courses})
      })
    })
  }

  getStudents (key) {
    this.students = []
    this.registeredRef.child(key).once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
      this.students.push({displayName:snapshot.val().displayName, createdAt:snapshot.val().createdAt,
      key:snapshot.key})
        this.setState({students:this.students})
      })
    })
  }

  render() {
    return (

      <div className="Students">

        <header className="App-header">
          <h1 className="App-title">FYE class Analytics</h1>
          <h3>Welcome, {this.state.username}</h3>
        </header>


      <div className="container">
<br/>
      <div className="col-sm-8 col-sm-offset-2">
        {this.state.courses.map((course)=>
          <h3 className='text-center'>{course.name} ({course.code})</h3>
        )}
        <table className="table table-striped table-bordered bootstrap-datatable datatable">
  <thead>
    <tr>
      <th scope="col">#</th>

      <th scope="col">Student's Name</th>
      <th scope="col"> Signup Date</th>
      <th scope="col">Number of Tests Taken</th>
      <th scope="col">Number of Tests completed</th>
    </tr>
  </thead>
  <tbody>


      {this.state.students.map((student,key)=>
      <tr key={key}>
        <th scope="row">{key+1}</th>
        <td> <Link to={"/student/"+student.key}>{student.displayName}</Link> </td>
        <td>-</td>
        <td>an hour ago</td>
        <td> 5 </td>
      </tr>
      )}
  </tbody>
</table>

      </div>
      </div>

      </div>
    );
  }
}

export default Students;
