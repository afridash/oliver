import React, {Component} from 'react'
import {FormGroup, FormControl, ControlLabel, Col, Panel, Button, Modal} from 'react-bootstrap'
import {Questions} from './Questions'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class AddQuestions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      colleges:[],
      faculties:[],
      departments:[],
      courses:[],
      addQuestions:false,
      checked:false,
      showCourses:false,
    }
    this.collegesRef = firebase.database().ref().child('colleges')
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
    this.statsRef = firebase.database().ref().child('oliver_stats')
    this.courses = []
  }
  componentWillMount () {
    this.collegesRef.once('value', (snapshots)=>{
      this.colleges = []
      snapshots.forEach((snapshot)=>{
        this.colleges.push({key:snapshot.key, name:snapshot.val().college})
        this.setState({colleges:this.colleges})
      })
    })
  }
  handleChange (event) {
    this.setState({[event.target.name] : event.target.value})
  }
  handleSelect (event) {
    this.setState({faculties:[]})
    this.facultiesRef.child(event.target.value).once('value',(snapshots)=>{
      this.faculties = []
      snapshots.forEach((snapshot)=>{
        this.faculties.push({name:snapshot.val(), key:snapshot.key})
        this.setState({faculties:this.faculties})
      })
    })
  }
  handleSelectFaculty (event) {
    this.setState({loading:true, faculty:event.target.value, departments:[]})
    this.departmentsRef.child(event.target.value).once('value',(snapshots)=>{
      this.departments = []
      snapshots.forEach((snapshot)=>{
        this.departments.push({name:snapshot.val(), key:snapshot.key})
        this.setState({departments:this.departments})
      })
    })
  }
  handleSelectDepartment (event) {
    this.setState({departmentKey:event.target.value,courses:[], showCourses:true})
    this.retrieveCourses (event.target.value)
  }
  retrieveCourses(key) {
    this.coursesRef.child(key).once('value',(snapshots)=>{
      snapshots.forEach((snapshot)=>{
        this.courses.push({name:snapshot.val().name, key:snapshot.key})
        this.setState({courses:this.courses})
      })
    })
  }
  handleSelectCourse (event) {
    this.setState({courseKey:event.target.value, showAddButton:true})
  }
  showModal () {
    return (
      <Modal show={this.state.showModal} onHide={()=>this.setState({showModal:false})}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  placeholder="Course Code"
                  onChange={(event)=>this.handleChange(event)}
                />

                <FormControl.Feedback />
              </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.saveCourse()}>Save</Button>
          <Button onClick={()=>this.setState({showModal:false})}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  saveCourse () {
    var data = {
      name:this.state.name,
      code:this.state.code
    }
    var key = this.coursesRef.child(this.state.departmentKey).push(data).key
    this.courses.push({name:this.state.name, key:key})
    this.setState({courses:this.courses, name:'', code:'', showModal:false})
    var ref = this.statsRef.child('courses').once('value', (courses)=>{
      courses.ref.set(courses.val() + 1)
    })
  }
  selectDetails () {
    return (
      <div>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Choose University</ControlLabel>
          <select className='form-control' onChange={(event)=>{this.handleSelect(event); this.setState({showFaculties:true})}} name='selected'>
            <option></option>
            {this.state.colleges.map((college, key)=> <option key={key} value={college.key}>{college.name}</option>)}
          </select>
          </FormGroup>

          <FormGroup
            controlId="formBasicText"
            >
            <ControlLabel>Choose Faculty</ControlLabel>
            <select className='form-control' onChange={(event)=>{this.handleSelectFaculty(event); this.setState({showDepartments:true})}} name='selected'>
              <option></option>
                {this.state.faculties.map((faculty, key)=> <option key={key} value={faculty.key}>{faculty.name}</option>)}
            </select>
          </FormGroup>

            <FormGroup
              controlId="formBasicText"
              >
              <ControlLabel>Choose Department</ControlLabel>
              <select className='form-control' onChange={(event)=>{this.handleSelectDepartment(event)}} name='selected'>
                <option></option>
                  {this.state.departments.map((department, key)=> <option key={key} value={department.key}>{department.name}</option>)}
              </select>
            </FormGroup>
            {this.state.showCourses ? this.showCourses() : <div></div>}
              {this.showModal()}
      </div>
    )
  }
  showCourses () {
    return (
      <FormGroup
        controlId="formBasicText"
        >
        <ControlLabel>Choose Course, if not found, add a new one...then select it</ControlLabel>
        <select className='form-control' onChange={(event)=>{this.handleSelectCourse(event)}} name='selected'>
          <option></option>
            {this.state.courses.map((course, key)=> <option key={key} value={course.key}>{course.name}</option>)}
        </select>
        <Button style={{marginTop:10}} onClick={()=>this.setState({showModal:true})}>Add New</Button>
      </FormGroup>
    )
  }
  close () {
    this.setState({showAddButton:false, addQuestions:true})
  }
  done () {
    this.setState({addQuestions:false})
  }
  render () {
    return (
      <Col xs={12} md={8} mdOffset={2} style={{marginTop:'5%'}}>
        <Panel header="Add Questions" bsStyle="primary" >
          <h5 className='text-warning'>Choose university, faculty, department and course to add questions</h5>
          <form>
            {this.state.addQuestions ? <Questions courseKey={this.state.courseKey} close={this.done.bind(this)} /> : this.selectDetails()}
            {this.state.showAddButton ?<Button bsSize='small' bsStyle='primary' onClick={()=>this.close()}>Add Questions</Button>: <div></div>}
          </form>
        </Panel>
        <div className='text-center' style={{marginTop:30}}>
          <Link to="/questions"><Button bsStyle='danger' bsSize='small'>Go Home</Button></Link>
        </div>
      </Col>
    )
  }
}
