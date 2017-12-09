import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
import * as TimeStamp from '../auth/timestamp'
import {Link} from 'react-router-dom'
import moment from 'moment'
import './App.css';
var fileDownload = require('js-file-download')
const firebase =  require('firebase')
var json2csv = require('json2csv');
var fields = ['Name', 'Last_Login', 'Tests_Started', 'Tests_Completed', 'Average_Score'];
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
    this.activitiesRef = firebase.database().ref().child('course_activities')
    this.students = []
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
    this.registeredRef.child(key).once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
        this.statRef.child(key).child(snapshot.key).child('total_started').once('value', (started)=>{
            this.statRef.child(key).child(snapshot.key).child('total_completed').once('value', (completed)=>{
              firebase.database().ref().child('users').child(snapshot.key).child('last_seen').once('value', (login)=>{
                this.activitiesRef.child(key).child(snapshot.key).once('value', (activities)=>{
                  var total = 0
                  var num = 0
                   activities.forEach((activity)=>{
                    total += Number(activity.val().percentage)
                    num += 1
                  })
                  this.students.push({displayName:snapshot.val().displayName, createdAt:snapshot.val().createdAt, average: num === 0 ? 0 : (total/num).toFixed(2),
                  key:snapshot.key, course:key,total_started:started.val(), total_completed:completed.val(), last_seen:login.val()})
                  this.setState({students:this.students})

                })

              })
            })
        })
      })
    })
  }
  handleDownload = (event) => {
    var myData = []
    this.students.map ((student)=>
    myData.push({Name:student.displayName,
      Last_Login:TimeStamp.timeSince(student.last_seen),
      Tests_Started:student.total_started,
      Tests_Completed:student.total_completed,
      Average_Score:student.average})
    )
    var result = json2csv({ data: myData, fields: fields })
    fileDownload(result, 'oliver_stats.csv');
  }
  render() {
    return (

      <div className="Students">

        <header className="App-header">
          <h1 className="App-title">FYE Class Analytics</h1>
          <h3>Welcome, {this.state.username}</h3>
        </header>

      <div className="container">
<br/>
      <div className="col-sm-8 col-sm-offset-2">
        {this.state.courses.map((course)=>
          <h3 className='text-center'>{course.name} ({course.code})</h3>
        )}
        <button onClick={this.handleDownload} className='btn btn-primary pull-right' style={{margin:10}}>DOWNLOAD</button>
        <table className="table table-striped table-bordered bootstrap-datatable datatable">
  <thead>
    <tr>
      <th scope="col">#</th>

      <th scope="col">Student's Name</th>
      <th scope="col"> Last Login</th>
      <th scope="col">Number of Tests started</th>
      <th scope="col">Number of Tests completed</th>
      <th scope="col">Average Score (%)</th>
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
        <td>{student.average}</td>
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
