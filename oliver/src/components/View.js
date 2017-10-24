import React, {Component} from 'react'
import {FormGroup, FormControl, ControlLabel, Col, Panel, Button, Modal} from 'react-bootstrap'
import {Questions} from './ViewQuestions'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class View extends Component {
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
      courseName:'',
    }
    this.collegesRef = firebase.database().ref().child('colleges')
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
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
    this.courses = []
    this.coursesRef.child(key).once('value',(snapshots)=>{
      snapshots.forEach((snapshot)=>{
        this.courses.push({name:snapshot.val().name, key:snapshot.key})
        this.setState({courses:this.courses})
      })
    })
  }
  handleSelectCourse (event) {
    this.setState({courseKey:event.target.value, courseName:event.target.name, showViewButton:true})
  }
  selectDetails () {
    return (
      <div>
        <h5 className='text-warning'>Choose university, faculty, department and course to view questions</h5>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Choose University</ControlLabel>
          <select className='form-control' onChange={(event)=>{this.handleSelect(event); this.setState({showFaculties:true})}}>
            <option></option>
            {this.state.colleges.map((college, key)=> <option key={key} value={college.key} >{college.name}</option>)}
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
      </div>
    )
  }
  showCourses () {
    return (
      <FormGroup
        controlId="formBasicText"
        >
        <ControlLabel>Choose Course</ControlLabel>
        <select className='form-control' onChange={(event)=>{this.handleSelectCourse(event)}} >
          <option></option>
            {this.state.courses.map((course, key)=> <option key={key} value={course.key} >{course.name}</option>)}
        </select>
      </FormGroup>
    )
  }
  done () {
    this.setState({viewQuestions:false})
  }
  close () {
    this.setState({showViewButton:false, viewQuestions:true})
  }
  render () {
    return (
      <Col md={8} mdOffset={2} xs={12} style={{marginTop:'5%'}}>
        <Panel header={"View Questions " + this.state.courseName} bsStyle="primary" >
          <form>
            {this.state.viewQuestions ? <Questions courseKey={this.state.courseKey} close={this.done.bind(this)} /> : this.selectDetails()}
            {this.state.showViewButton ?<Button  bsStyle='primary' onClick={()=>this.close()}>View Questions</Button>: <div></div>}
          </form>
        </Panel>
        <div className='text-center' style={{marginTop:30}}>
          <Link to="/questions"><Button bsStyle='danger'>Go Home</Button></Link>
        </div>
      </Col>
    )
  }
}
