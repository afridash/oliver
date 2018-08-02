import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')

export default class AddDepartment extends Component {
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
  saveDepartment () {
    let key = this.ref.child(this.props.faculty).push(this.state.department).key
    this.ref.child(key).update({courses:0, questions:0, createdBy:this.props.user})
    this.collegeRef.child(this.props.university).child('departments').once('value',(departments)=>{
      departments.ref.set(departments.val() + 1)
    })
    this.facultyRef.child(this.props.faculty).child('departments').once('value', (departments)=>{
      departments.ref.set(departments.val()+1)
    })
    this.setState({submittedDepartment:true, message:'Successfully added '+this.state.department, department:''})
  }
  showNewDepartment () {
    return (
      <div>
      <FormGroup
        controlId="formBasicText"
        >
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
        <Button bsStyle="primary" bsSize="large" onClick={(event)=>this.saveDepartment(event)}>Save</Button>
        </div>
    )
  }
  render () {
    return (this.showNewDepartment())
  }
}
