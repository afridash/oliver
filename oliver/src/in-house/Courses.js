import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

export default class AddCourses extends Component {
  constructor (props) {
    super (props)
    this.state ={
      selected:'',
      faculty:'',
      department:'',
      showDepartments:false,
      addDepartment:false,
      colleges:[],
      faculties:[],
      departments:[],
    }
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
    this.statsRef = firebase.database().ref().child('oliver_stats')
  }
  handleChange (event) {
    this.setState({[event.target.name]:event.target.value})
  }
  saveCourse () {
    if (this.state.name !== '' && this.state.code !== '' && this.state.year !== '') {
      var data = {
        name:this.state.name,
        code:this.state.code,
        year:this.state.year,
        createdBy:this.props.user,
        questions:0
      }
      var key = this.coursesRef.child(this.props.department).push(data).key

      //Update General Oliver Stats (number of courses)
       this.statsRef.child('courses').once('value', (courses)=>{
        courses.ref.set(courses.val() + 1)
      })

      //Update Department Stats
      this.departmentsRef.child(this.props.department).child('courses').once('value', (courses)=>{
        courses.ref.set(courses.val()+1)
      })

    }
  }
  showNewDepartment () {
    return (
      <div>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Enter Course Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.name}
              name="name"
              placeholder="Course Title"
              onChange={(event)=>this.handleChange(event)}
            />

            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Enter Course Code</ControlLabel>
              <FormControl
                type="text"
                value={this.state.code}
                name="code"
                placeholder="Course Title"
                onChange={(event)=>this.handleChange(event)}
              />

              <FormControl.Feedback />
            </FormGroup>
          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Enter Course Year</ControlLabel>
              <FormControl
                type="text"
                value={this.state.year}
                name="year"
                placeholder="Course Year"
                onChange={(event)=>this.handleChange(event)}
              />

              <FormControl.Feedback />
            </FormGroup>
        <Button bsStyle="primary" bsSize="large" onClick={(event)=>this.saveCourse(event)}>Save</Button>
        </div>
    )
  }
  render () {
    return (this.showNewDepartment())
  }
}
