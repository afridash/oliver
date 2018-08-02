import React, {Component} from 'react'
import {FormControl, FormGroup, Col, Table, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
import {Questions} from './ViewQuestions'
import CircularProgress from 'material-ui/CircularProgress'
import NavBar from './navBar'
const firebase =  require('firebase')
export class Stats extends Component {
  constructor (props){
    super (props)
    this.state ={
      elements: [],
      showQuestions:false,
      search:'',
      title:'',
      loading:true,
      sortOrder:"Descending",
      totalQuestions:0
    }
    this.collegesRef = firebase.database().ref().child('colleges')
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef= firebase.database().ref().child('courses')
    this.collegeId = this.props.match.params.id
    this.elements = []
  }
  handleChange = (event) => {
    if (event.target.value === "Ascending") {
      this.setState({elements:this.elements.sort((a,b)=>a.questions-b.questions), sortOrder:event.target.value })
    }else if (event.target.value === "Descending") {
      this.setState({elements:this.elements.sort((a,b)=>b.questions-a.questions), sortOrder:event.target.value})
    }else {
      this.elements.sort((a,b)=>{
        var x = a.course.toLowerCase();
        var y = b.course.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      this.setState({elements:this.elements, sortOrder:event.target.value})
    }
  }
  done () {
    this.setState({showQuestions:false})
  }
  filterResult (text) {
    var clone = this.elements
    this.results = clone.filter((element)=>{
      return element.course.toLowerCase().includes(text.toLowerCase()) === true || element.department.toLowerCase().includes(text.toLowerCase()) === true
    })
    let questions = 0
    this.results.forEach((course)=>{
      questions += course.questions
    })
    this.setState({elements:this.results,search:text, totalQuestions:questions})
  }
  async componentWillMount (){
    this.collegesRef.child(this.collegeId).child('college').once('value', (college)=>{
      this.setState({title:college.val()})
    })
    this.facultiesRef.child(this.collegeId).once('value', (faculties)=>{
      faculties.forEach((faculty)=>{
        this.departmentsRef.child(faculty.key).once('value', (departments)=>{
          departments.forEach((department)=>{
            this.coursesRef.child(department.key).once('value', (courses)=>{
              courses.forEach((course)=>{
                this.elements.push({faculty:faculty.val(), department:department.val(), course:course.val().name, questions:course.val().questions, courseKey:course.key})
                this.elements.sort((a,b)=>b.questions - a.questions)
                this.setState({elements:this.elements, loading:false, totalQuestions:this.state.totalQuestions + course.val().questions})
              })
            })
          })
        })
      })
    })
  }
  spinner () {
    return (
      <div className="row text-center">
          <br/>
          <br/>
          <CircularProgress size={60} thickness={5} />
      </div>
    )
  }
  showTable () {
    return (
      <div>
        <h2 className='text-center'>{this.state.title}</h2>
        <div className='col-sm-12 text-center'>
          <span className='lead'>Questions: {this.state.totalQuestions}</span>
        </div>
        <div style={{width:200}}>
          <p>Sort Order</p>
          <select value={this.state.sortOrder} onChange={this.handleChange} className='form-control'>
            <option value="Descending">Descending</option>
            <option value="Ascending">Ascending</option>
            <option value="Alphabetically">Alphabetically</option>
          </select>
        </div>
        <br />
        <FormGroup
          controlId="formBasicText"
          >
            <FormControl
              type="text"
              value={this.state.search}
              name="question"
              placeholder="Search"
              onChange={(event)=>this.filterResult(event.target.value)}
            />
            <FormControl.Feedback />
          </FormGroup>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
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
  showPageContent () {
    return (
      <Col xs={12} md={10} mdOffset={1}>
        {this.state.showQuestions ? <Questions courseKey={this.state.course} close={this.done.bind(this)} /> : this.showTable()}
        <div className='text-center'>
          <Link to="/in-house/home"><Button bsStyle='danger' bsSize='small' >Go Home</Button></Link>
          </div>
      </Col>
    )
  }
  pageContent () {
    return (
      <div className="col-sm-12">
          <div style={{marginTop:70}}></div>
          {
            (()=>{
              if (this.state.loading){
                return this.spinner()
              }
              else {
                return this.showPageContent()
              }
            })()
          }
      </div>
    )
  }
  render () {
    return (
      <NavBar children={this.pageContent()} />
    )
  }
}
