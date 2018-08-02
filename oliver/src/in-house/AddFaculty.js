import React, {Component} from 'react'
import { FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export default class Faculty extends Component{
  constructor (props) {
    super (props)
    this.state = {
      selected:'',
      showFaculties:false,
      addFaculty:false,
      colleges:[],
      faculties:[],
      loading:true,
    }
    this.collegesRef = firebase.database().ref().child('colleges')
    this.ref = firebase.database().ref().child('faculties')
  }
  handleChange (event) {
    this.setState({[event.target.name]:event.target.value})
  }
  showNewFaculty () {
    return (
      <div>
      <FormGroup
        controlId="formBasicText"
        >
          <FormControl
            type="text"
            value={this.state.faculty}
            name="faculty"
            placeholder="Enter Faculty"
            onChange={(event)=>this.handleChange(event)}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Button bsStyle="primary" bsSize="large" onClick={()=>this.saveFaculty()}>Save</Button>
        </div>
    )
  }
  saveFaculty () {
    let key = this.ref.child(this.props.university).push(this.state.faculty).key
    this.ref.child(key).update({questions:0, departments:0, createdBy:this.props.user})
    this.collegesRef.child(this.props.university).child('faculties').once('value',(faculties)=>{
      faculties.ref.set(faculties.val() + 1)
    })
    this.setState({faculty:'', submittedFaculty:true})
  }
  render () {
    return (this.showNewFaculty())
  }
}
