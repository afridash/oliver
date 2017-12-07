import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class AddUniversity extends Component {
  constructor (props) {
    super (props)
    this.state ={
      university:'',
      location:'',
      colleges:[],
    }
    this.ref = firebase.database().ref().child('colleges')
    this.statsRef = firebase.database().ref().child('oliver_stats').child('colleges')
  }
  componentDidMount () {
    this.ref.once('value', (snapshots)=>{
      this.colleges = []
      snapshots.forEach((snapshot)=>{
        this.colleges.push(snapshot.val())
        this.setState({colleges:this.colleges})
      })
    })
  }
  handleChange (event) {
    this.setState({[event.target.name]:event.target.value, submittedUniversity:false})
  }
  saveUniversity () {
    var data = {
      college:this.state.university,
      location:this.state.location
    }
    this.ref.push(data)
    var ref = this.statsRef.once('value', (colleges)=>{
      colleges.ref.set(colleges.val() + 1)
    })
    this.setState({university:'', location:'', submittedUniversity:true})
  }
  showUniversityForm () {
    return (
      <div>
      <h3 className='text-danger'>Before adding a new university, ensure it doesn't already exist <Button  bsStyle="primary"  bsSize="small" onClick={()=>this.open()}>here</Button></h3>
      <p className='text-center text-info'>Add New University</p>
      {this.state.submittedUniversity ? <p className='text-center text-success'>Successfully Added New University</p> :<div></div>}
      <form>
        <FormGroup
          controlId="formBasicText"
          >
            <ControlLabel>Enter University</ControlLabel>
            <FormControl
              type="text"
              value={this.state.university}
              name='university'
              placeholder="Enter text"
              onChange={(event)=>this.handleChange(event)}
            />
          </FormGroup>

          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Enter State</ControlLabel>
              <FormControl
                type="text"
                value={this.state.location}
                name="location"
                placeholder="Enter State"
                onChange={(event)=>this.handleChange(event)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" bsSize="small" onClick={()=>this.saveUniversity()}>Save</Button>
        </form>
          {this.showModal()}
        </div>
    )
  }
  close () {
    this.setState({showModal:false})
  }
  open () {
    this.setState({showModal:true})
  }
  showModal () {
    return (
      <Modal show={this.state.showModal} onHide={()=>this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>List of Universities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.colleges.map((college, key)=>
            <div>
              <p>{college.college} ------- {college.location}</p>
              <hr />
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.close()}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  render () {
    return (this.showUniversityForm())
  }
}
