import React, {Component} from 'react'
import  {Col, Panel, Button} from 'react-bootstrap'
import {Questions} from './Questions'
import NavBar from './navBar'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class AddQuestions extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.collegeId = this.props.match.params.college
    this.facultyId = this.props.match.params.faculty
    this.departmentId = this.props.match.params.department
    this.courseId = this.props.match.params.course
    this.coursesRef = firebase.database().ref().child('courses')
  }
  componentWillMount(){
    this.coursesRef.child(this.departmentId).child(this.courseId).child('name').once('value', (name)=>{
      this.setState({title:name.val()})
    })
  }
  showPageContent () {
    return (
      <Col xs={12} md={8} mdOffset={2} style={{marginTop:'5%'}}>
        <h3 className='text-center'> Add Questions to: {this.state.title}</h3>
          <Questions courseKey={this.courseId} college={this.collegeId} faculty={this.facultyId} department={this.departmentId} />
      </Col>
    )
  }
  render () {
    return (
      <NavBar children={this.showPageContent()} />
    )
  }
}
