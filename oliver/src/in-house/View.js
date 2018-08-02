import React, {Component} from 'react'
import {Col} from 'react-bootstrap'
import {Questions} from './ViewQuestions'
import NavBar from './navBar'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class View extends Component {
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
  componentWillMount () {
    this.coursesRef.child(this.departmentId).child(this.courseId).child('name').once('value', (title)=>{
      this.setState({courseName:title.val()})
    })
  }
  showPageContent () {
    return(
      <Col md={8} mdOffset={2} xs={12} style={{marginTop:'5%'}}>
        <h3 className='text-center'>{this.state.courseName}</h3>
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
