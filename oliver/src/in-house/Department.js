import React, { Component } from 'react'
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import NavBar from './navBar'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import {Firebase} from '../auth/firebase'
import AddCourses from './Courses'
const firebase =  require('firebase')
export default class Department extends Component {
  constructor (props){
    super (props)
    this.state = {
      colleges:[],
      loading:true,
      displayName:'Anonymous'
    }
    this.colleges = []
    this.ref = firebase.database().ref().child('faculties')
    this.collegesRef = firebase.database().ref().child('colleges')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
    this.collegeId = this.props.match.params.id
    this.facultyId = this.props.match.params.faculty
    this.departmentId = this.props.match.params.department
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {
      this.setState({displayName:user.email})
    }
  }
  async componentWillMount (){
    this.coursesRef.child(this.departmentId).once('value', (colleges)=>{
      if (!colleges.exists()) this.setState({loading:false})
      colleges.forEach((college)=>{
          this.colleges.unshift({
            name:college.val().name,
            code:college.val().code,
            questions:college.val().questions,
            createdBy:college.val().createdBy,
            key:college.key,
          })
            this.setState({colleges:this.colleges, loading:false})
        })
    })
    this.collegesRef.child(this.collegeId).child('college').once('value', (college)=>{
      this.setState({title:college.val()})
    })
    this.ref.child(this.collegeId).child(this.facultyId).once('value', (faculty)=>{
      this.setState({faculty:faculty.val()})
    })
    this.departmentsRef.child(this.facultyId).child(this.departmentId).once('value', (department)=>{
      this.setState({department:department.val()})
    })
  }
  handleChange = (event) => {
    if (event.target.value === "Ascending") {
      this.setState({colleges:this.colleges.sort((a,b)=>a.questions-b.questions), sortOrder:event.target.value })
    }else if (event.target.value === "Descending") {
      this.setState({colleges:this.colleges.sort((a,b)=>b.questions-a.questions), sortOrder:event.target.value})
    }else {
      this.colleges.sort((a,b)=>{
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      this.setState({colleges:this.colleges, sortOrder:event.target.value})
    }
  }
  handleClose = () => {
    this.setState({openDialog: false});
  };
  spinner () {
    return (
      <div className="row text-center">
          <br/>
          <br/>
          <CircularProgress size={60} thickness={5} />
      </div>
    )
  }
  showPageContent () {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <div className='col-sm-12'>
        <div>
          /<Link to={'/in-house/home'} style={{textDecoration:'none'}}>Home</Link>
          /<Link to={'/in-house/college/'+this.collegeId} style={{textDecoration:'none'}}>{this.state.title}</Link>
          /<Link to={'/in-house/college/'+this.collegeId+'/'+this.facultyId} style={{textDecoration:'none'}}>{this.state.faculty}</Link>
          /<Link to={'#'} style={{textDecoration:'none'}}>{this.state.department}</Link>
        </div>
          <div style={{marginLeft:20}} className='pull-left'>
            <p>Sort Order</p>
            <select value={this.state.sortOrder} onChange={this.handleChange} className='form-control'>
              <option value=""></option>
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
              <option value="Alphabetically">Alphabetically</option>
            </select>
          </div>
          <div className='pull-right'>
            <RaisedButton label="Add New" secondary onClick={()=>this.setState({openDialog:true})}  />
          </div>
          <div className='col-sm-12'>
          {this.state.colleges.map((college, key)=>
            this.showCollege(college,key)
          )}
        </div>
        <Dialog
          title="Add Course"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
        >
          <AddCourses university={this.collegeId} faculty={this.facultyId} department={this.departmentId} user={this.state.displayName} />
        </Dialog>
      </div>
    )
  }
  showCollege (college, index) {
    return (
      <div className="col-sm-4">
        <div style={{margin:10}}>
          <Paper zDepth={2} rounded={true}>
            <Panel>
              <div className="card">
                <div className="card card-body">
                  <div className="row">
                    <div className="col-sm-12" >
                      <p className='lead' > {college.name} ({college.code})</p>
                    </div>
                    <div className="col-sm-12">
                      <span style={{color:'#580E0E'}}>Ques: {college.questions}</span>
                    </div>
                    <div className='col-sm-12' style={{marginTop:20, marginBottom:20}}>
                      <span style={{color:'#580E0E'}}>Created By: {college.createdBy}</span>
                    </div>
                    <div className='text-center' style={{marginTop:20}}>
                      <Link to={'/view/'+this.collegeId+'/'+this.facultyId+'/'+this.departmentId+'/'+college.key}><RaisedButton label="View" primary  /></Link> &nbsp;&nbsp;
                      <Link to={'/add/'+this.collegeId+'/'+this.facultyId+'/'+this.departmentId+'/'+college.key}><RaisedButton label="Add" secondary   /> </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </Paper>
        </div>
      </div>
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
  render() {
    return (
      <NavBar children={this.pageContent()} />
    );
  }
}
