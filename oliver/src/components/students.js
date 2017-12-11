import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
import * as TimeStamp from '../auth/timestamp'
import {Link, Redirect} from 'react-router-dom'
import moment from 'moment'
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
      courseId:'',
    }
    firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
    this.studentsRef = firebase.database().ref().child('user_courses')
    this.registeredRef = firebase.database().ref().child('registered_courses')
    this.statRef = firebase.database().ref().child('student_stats')
  }

  handleUser (user) {
    if (user){
      this.setState({userId:user.uid, username:user.displayName})
      this.loadCourses()
    }
  }

  handleLogout (event) {
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
   // An error happened.
     });
       this.setState({redirect:true})
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
        this.statRef.child(key).child(snapshot.key).child('total_started').once('value', (started)=>{
            this.statRef.child(key).child(snapshot.key).child('total_completed').once('value', (completed)=>{
              firebase.database().ref().child('users').child(snapshot.key).child('last_seen').once('value', (login)=>{
                this.students.push({displayName:snapshot.val().displayName, createdAt:snapshot.val().createdAt,
                key:snapshot.key, course:key,total_started:started.val(), total_completed:completed.val(), last_seen:login.val()})
                this.setState({students:this.students})
              })
            })
        })
      })
    })
  }

  render() {
    return (

    this.state.redirect ? <Redirect to='/Login' push/> : <div className="Students">

        <header className="App-header">
          <h1 className="App-title">FYE Class Analytics</h1>
          <h3 className='pull-left'>Welcome, {this.state.username}</h3>
          <button className='btn btn-danger pull-right' onClick={(event) => this.handleLogout(event)}>Sign Out</button>
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
      <th scope="col"> Last Login</th>
      <th scope="col">Number of Tests started</th>
      <th scope="col">Number of Tests completed</th>
    </tr>
  </thead>
  <tbody>

      {this.state.students.map((student,key)=>
      <tr key={key}>
        <th scope="row">{key+1}</th>
        <td> <Link to={"/student/"+student.key+'/'+student.course}>{student.displayName}</Link> </td>
        <td>{TimeStamp.timeSince(student.last_seen)}</td>
        <td>{student.total_started}</td>
        <td>{student.total_completed}</td>
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
