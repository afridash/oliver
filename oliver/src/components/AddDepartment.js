import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

export class AddDepartment extends Component {
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
    this.collegeRef = firebase.database().ref().child('colleges')
    this.facultyRef = firebase.database().ref().child('faculties')
    this.ref = firebase.database().ref().child('departments')
  }
  handleChange (event) {
    this.setState({[event.target.name]:event.target.value})
  }
  handleSelect (event) {
    this.setState({faculties:[]})
    this.facultyRef.child(event.target.value).once('value',(snapshots)=>{
      this.faculties = []
      snapshots.forEach((snapshot)=>{
        this.faculties.push({name:snapshot.val(), key:snapshot.key})
        this.setState({faculties:this.faculties})
      })
    })
  }
  handleSelectFaculty (event) {
    this.setState({loading:true, faculty:event.target.value, departments:[], addDepartment:false, submittedDepartment:false})
    this.ref.child(event.target.value).once('value',(snapshots)=>{
      this.departments = []
      snapshots.forEach((snapshot)=>{
        this.departments.push({name:snapshot.val(), key:snapshot.key})
        this.setState({departments:this.departments})
      })
    })
    this.setState({loading:false})
  }

  saveDepartment () {
    this.ref.child(this.state.faculty).push(this.state.department)
    this.setState({submittedDepartment:true, message:'Successfully added '+this.state.department, department:''})
  }

  componentWillMount () {
    this.collegeRef.once('value', (snapshots)=>{
      this.colleges = []
      snapshots.forEach((snapshot)=>{
        this.colleges.push({key:snapshot.key, name:snapshot.val().college})
        this.setState({colleges:this.colleges})
      })
    })
  }
  showDepartmentForm () {
    return (
      <div>
      <h3 className='text-center text-info'>Add New Department</h3>
      <p className="text-danger text-center">Choose university and faculty to see list of departments, and add new ones!</p>
      <form>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Choose University</ControlLabel>
          <select className='form-control' onChange={(event)=>this.handleSelect(event)} name='selected'>
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
          {this.state.showDepartments ? this.decideDepartment() : <div></div> }

        </form>
        </div>
    )
  }

  decideDepartment () {
    return (
      this.state.addDepartment ? this.showNewDepartment() : this.showDepartments()
    )
  }

  showNewDepartment () {
    return (
      <div>
      <FormGroup
        controlId="formBasicText"
        >
          <ControlLabel>Enter Department</ControlLabel>
          <FormControl
            type="text"
            value={this.state.department}
            name="department"
            placeholder="Enter Department"
            onChange={(event)=>this.handleChange(event)}
          />
          <FormControl.Feedback />
          {this.state.submittedDepartment ? <p className='text-success'>{this.state.message}</p> : <div></div>}
        </FormGroup>
        <Button bsStyle="primary" bsSize="small" onClick={(event)=>this.saveDepartment(event)}>Save</Button>
        </div>
    )
  }

  showDepartments () {
    return (
      <div>
        <div className='text-center'>
          <h5>LIST OF DEPARTMENTS</h5>
          {this.state.departments.map((department,key)=> <p key={key}>{key+1}. {department.name}</p>)}
          <Button bsStyle='primary' bsSize="small" onClick={()=>this.setState({addDepartment:true,})}>Add New</Button>
        </div>
      </div>
    )
  }
  render () {
    return (this.showDepartmentForm())
  }
}
