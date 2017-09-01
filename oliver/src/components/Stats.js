import React, {Component} from 'react'
import {FormControl, FormGroup, Col, Table, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
import {Questions} from './ViewQuestions'
const firebase =  require('firebase')
export class Stats extends Component {
  constructor (props){
    super (props)
    this.state ={
      elements: [],
      showQuestions:false,
      search:'',
    }
    this.collegesRef = firebase.database().ref().child('colleges')
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
    this.questionsRef = firebase.database().ref().child('questions')
  }
  done () {
    this.setState({showQuestions:false})
  }
  filterResult (text) {
    var clone = this.elements
    this.results = clone.filter((element)=>{
      return element.university.toLowerCase().includes(text.toLowerCase()) === true || element.course.toLowerCase().includes(text.toLowerCase()) === true
    })
    this.setState({elements:this.results,search:text})
  }
  async componentWillMount (){
    this.totalQuestions = 0
    this.elements = []
      this.collegesRef.once('value', (universities)=>{
      universities.forEach((university)=>{
        this.facultiesRef.child(university.key).once('value', (faculties)=>{
          faculties.forEach((faculty)=>{
            this.departmentsRef.child(faculty.key).once('value', (departments)=>{
              departments.forEach((department)=>{
                this.coursesRef.child(department.key).once('value', (courses)=>{
                  courses.forEach((course)=>{
                    this.questionsRef.child(course.key).once('value', (questions)=>{
                      this.num = 0
                      questions.forEach((question)=>{
                        this.num +=1
                      })
                      this.elements.push({university:university.val().college, faculty:faculty.val(), department:department.val(), course:course.val().name,courseKey:course.key, questions:this.num})
                      this.setState({elements:this.elements})
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }
  showTable () {
    return (
      <div>
        <FormGroup
          controlId="formBasicText"
          >
            <FormControl
              type="text"
              value={this.state.search}
              name="question"
              placeholder="Filter by university or course"
              onChange={(event)=>this.filterResult(event.target.value)}
            />

            <FormControl.Feedback />
          </FormGroup>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Universiy</th>
              <th>Faculty</th>
              <th>Department</th>
              <th>Course</th>
              <th>Number of Questions</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {this.state.elements.map((element, key)=>
              <tr key={key}>
                <td>{key+1}</td>
                <td>{element.university}</td>
                <td>{element.faculty}</td>
                <td>{element.department}</td>
                <td>{element.course}</td>
                <td>{element.questions}</td>
                <td><Button bsStyle='primary' onClick={()=>this.setState({course:element.courseKey, showQuestions:true})}>View</Button></td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }
  render () {
    return (
      <Col xs={12} md={10} mdOffset={1} style={{marginTop:'5%'}}>
        {this.state.showQuestions ? <Questions courseKey={this.state.course} close={this.done.bind(this)} /> : this.showTable()}
        <div className='text-center'>
          <Link to="/"><Button bsStyle='danger' bsSize='small' >Go Home</Button></Link>
          </div>
      </Col>
    )
  }
}
