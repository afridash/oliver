import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class AddFaculty extends Component{
  constructor (props) {
    super (props)
    this.state ={
      selected:'',
      showFaculties:false,
      addFaculty:false,
      colleges:[],
      faculties:[],
      loading:true,
    }
    this.collegeRef = firebase.database().ref().child('colleges')
    this.ref = firebase.database().ref().child('faculties')
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
  handleChange (event) {
    this.setState({[event.target.name]:event.target.value})
  }
  handleSelect (event) {
    this.setState({loading:true, university:event.target.value, faculties:[], addFaculty:false})
    this.ref.child(event.target.value).once('value',(snapshots)=>{
      this.faculties = []
      snapshots.forEach((snapshot)=>{
        this.faculties.push({name:snapshot.val()})
        this.setState({faculties:this.faculties})
      })
      this.setState({loading:false})
    })
  }
  showList () {
    return (
      this.state.faculties.map((faculty, key)=>
        <p key={key}>{key+1}. {faculty.name}</p>
      )
    )
  }
  showFacultyForm () {
    return (
      <div>
      <h3 className='text-center text-info'>Add New Faculty</h3>
      <p className="text-danger text-center">Choose university see list of faculties, and add new ones!</p>
        {this.state.submittedFaculty ? <p className="text-success text-center">Successfully Added Faculty</p> : <div></div>}
      <form>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Choose University</ControlLabel>
          <select className='form-control' onChange={(event)=>{this.handleSelect(event); this.setState({showFaculties:true})}} name='selected'>
            <option></option>
            {this.state.colleges.map((college, key)=> <option key={key} value={college.key}>{college.name}</option>)}
          </select>
          </FormGroup>
          {this.state.showFaculties ? this.decideFaculty() : <div></div> }

        </form>
        </div>
    )
  }
  showFaculties () {
    return (
      <div>
        <h5 className='text-center'>LIST OF FACULTIES</h5>
        {this.state.loading ? <p className='text-center'>Loading...</p> :<div></div>}
        <div className='text-center'>
          {this.state.faculties.length > 0 ? this.showList() : <p>No Faculties Found</p>}
          <Button bsStyle='primary' bsSize="small" onClick={()=>this.setState({addFaculty:true,})}>Add New</Button>
        </div>
      </div>
    )
  }
  decideFaculty () {
    return (
      this.state.addFaculty ? this.showNewFaculty() : this.showFaculties()
    )
  }
  showNewFaculty () {
    return (
      <div>
      <FormGroup
        controlId="formBasicText"
        >
          <ControlLabel>Enter Faculty</ControlLabel>
          <FormControl
            type="text"
            value={this.state.faculty}
            name="faculty"
            placeholder="Enter Faculty"
            onChange={(event)=>this.handleChange(event)}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Button bsStyle="primary" bsSize="small" onClick={()=>this.saveFaculty()}>Save</Button>
        </div>
    )
  }
  saveFaculty () {
    this.ref.child(this.state.university).push(this.state.faculty)
    this.setState({faculty:'', submittedFaculty:true})
  }
  render () {
    return (this.showFacultyForm())
  }
}
