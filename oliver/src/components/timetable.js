import React, {Component} from 'react'
import {Link } from 'react-router-dom'
//import Auth from '../jsHelpers/auth'
import {Firebase} from '../jsHelpers/firebase'
const firebase = require('firebase')
export class Timetable extends Component {
  constructor(props){
    super(props)
    this.user = firebase.auth().currentUser
    this.courses=[]
    this.state={
      courses:[],
      preRegistration:[],
      registration:[],
      add:[],
      drop:[],
      courseIds: [],
      selectedCoursesID: [],
      selectedCourses:[],
      dropCourses:[],
      selected:false,
      loadingCourses:true,
      }
      firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
  }
  handleUser(user){
    if(user){
      this.setState({userId:user.uid})
      this.readRegistration()
    }
  }
  readRegistration(){
    //Retrieve the already registered classes from  the firebase db
    let selectedCourses = []
    firebase.database().ref().child("registration").child(this.state.userId).once('value', (snapshot)=> //Retrieve the Id's of the classes the user has registered
    {
      snapshot.forEach((childSnapShot)=> { //Same as above
        var ref = firebase.database().ref().child('courses').child(childSnapShot.val())
        ref.once('value', (snap)=>{
            selectedCourses.push({
              key:snap.key,
              title:snap.val().title,
              code:snap.val().code,
              credit:snap.val().credit,
              description:snap.val().description,
              level:snap.val().level,
              semester:snap.val().semester,
              selected: false
            })
            this.setState({selectedCourses, loadingCourses:false })
        })
      })
    })
  }
  showPageContent () {
    return (
      <div className="panel-body">
          <div className="dataTable_wrapper">
              <table className="table table-striped table-bordered table-hover" id="dataTables-example">
                <thead>
                    <tr>
                     <th>Course Title</th>
                    <th>Course Code</th>
                    <th>Credits</th>
                    <th>Description</th>
                    <th>Semester</th>
                    </tr>
                </thead>
                <tbody>
                  {this.state.selectedCourses.map((course, key)=>
                      <tr key={key}>
                      <td>{course.title}</td>
                      <td>{course.code}</td>
                      <td>{course.credit}</td>
                      <td>{course.description}</td>
                      <td>{course.semester}</td>
                    </tr>
                    )}
                </tbody>
              </table>
          </div>
          <div className="container" style={{marginBottom:50}} >
              <Link className="btn btn-danger" to="/advising">Close</Link>
          </div>
      </div>
    )
  }
  
  render() {
    return (
      <div id="page-wrapper">
        <Auth />
        <div id="title-breadcrumb-option-demo" className="page-title-breadcrumb">
            <div className="page-header pull-left">
                <div className="page-title">
                    Registered classes</div>
            </div>
            <ol className="breadcrumb page-breadcrumb pull-right">
                <li><i className="fa fa-home"></i>&nbsp;<Link to="/">Home</Link>&nbsp;&nbsp;<i className="fa fa-angle-right"></i>&nbsp;&nbsp;</li>
                <li className="hidden"><a href="#">Dashboard</a>&nbsp;&nbsp;<i className="fa fa-angle-right"></i>&nbsp;&nbsp;</li>
                <li className="active">Registered Classes</li>
            </ol>
            <div className="clearfix">
            </div>
        </div>
        <div className="page-content">
          <div id="tab-general">
            <div className="row mbl">
              <div className="col-lg-12 col-sm-12">
                <div className="row">
                  {this.state.loadingCourses ? <div className='text-center'>
                    <span style={{fontSize:30, color:'#2980b9', marginTop:'25%'}} className="fa fa-spinner fa-pulse fa-4x fa-fw"></span>
                    <span style={{fontSize:30, color:'#2980b9', marginTop:'25%'}}>Loading</span></div> : this.showPageContent()}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
