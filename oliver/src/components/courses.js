import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';
import { ToastContainer, toast } from 'react-toastify';
import Firebase from '../auth/firebase'
import _ from 'lodash'
import {
  blue300,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const style = {
  chip: {
    margin: 4,
    backgroundColor:'#cfecf7',
    //width:'100%'
  },
  paper:{
    textAlign: 'center',
    margin: 20,

  },
    height:50,
    textAlign: 'center',
};
export default class Search extends Component {
  constructor (props) {
    super (props)
    this.state = {
      collegeId:'',
      tagged: [],
      data:[],
      index: 0,
      isloading:true,
    }
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef =   firebase.database().ref().child('courses')
    this.userCoursesRef = firebase.database().ref().child('user_courses')
    this.registeredRef = firebase.database().ref().child('registered_courses')
  }
  handleUser = async (user) => {
    if (user) {
      this.setState({name:user.displayName, userId:user.uid})
      var collegeId = await localStorage.getItem('collegeId')
      await this.setState({collegeId})
      this.retrieveCoursesOnline()
    }
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  async saveToLocalStorage (course) {
     await localStorage.setItem('courseTitle', course.name)
     await localStorage.setItem('courseCode', course.code)
   }
  async retrieveCoursesOnline () {
    //1.Retrieve users courses from faculties in firebase and store them locally using AsyncStorage
    //Also filters the courses by department using the department Key
    this.data = []
     this.facultiesRef.child(this.state.collegeId).once('value', (snapshots)=>{
       if (!snapshots.exists()) {
         this.setState({isloading:false, noActivity:true})
       }
      snapshots.forEach((childSnap)=>{
        this.departmentsRef.child(childSnap.key).once('value', (snapshot)=>{
          snapshot.forEach((department)=>{
          this.coursesRef.child(department.key).once('value', (snap)=>{
              let tempData = []
              snap.forEach((course)=>{
                this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code, department:department.key, title:department.val()})
                this.addSection(this.data)
              })
            })
          })
        })
      })
    })
  }
  addSection(data) {
    var tempData = _.groupBy(data, d => d.title)
    tempData = _.reduce(tempData, (acc, next, index)=>{
      acc.push({
        key:index,
        data:next
      })
      return acc
    }, [])
    this.setState({data:tempData, isloading:false})
  }
  spinner () {
     return (
       <div className='row text-center'>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
       </div>
     )
   }
  noActivity () {
     return (
       <div className='row text-center'>
         <div className='col-sm-6 col-sm-offset-3'>
           <br />  <br />
           <p className='text-info lead'>No Courses Found</p>
           <Link to={"/AppHome"}>
             <RaisedButton label="Return Home" secondary={true} fullWidth={true} />
           </Link>
         </div>
         </div>
     )
   }
   //Add Course to firebase db only using their course name and code.
  writeAddCourses(item) {
     this.userCoursesRef.child(this.state.userId).child(item.key).set({
       name:item.name,
       code:item.code,
     });
     //Save userId under course
     this.registeredRef.child(item.key).child(this.state.userId).set({
       displayName:this.state.name,
       createdAt:firebase.database.ServerValue.TIMESTAMP
     })
     //Alerts the user when their entry has been inputted in firebase
     this.notify(item.name + ' was successfully added to your list')
  }
  notify = (message) => toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
  showPageContent () {
    return this.state.data.map((department, key)=> {
      var courses = department.data
      return (
        <div key={key} className='col-sm-12' style={{marginTop:40}}>
          <div className='text-center lead' style={{backgroundColor:'#2d6ca1', color:'white', padding:10}}>{department.key}</div>
          {courses.map((course, i)=>
            <div key={i} className="col-sm-4" >
              <Paper style={style.paper} zDepth={2} rounded={true}
                children={<div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div>
                        <Paper style={{padding:20,  textAlign:'center',backgroundColor:blue300, color:'white', fontSize:16}}  zDepth={2}
                          children={<div >
                          {course.code}
                        </div>}/>
                      </div>
                        <div className="row">
                          <div className="col-sm-10 col-sm-offset-1">
                            <Link to={"/theories/"+course.key}>
                              <RaisedButton label="Theory" fullWidth={true} style={style.chip} />
                            </Link>
                            <Link to={"/objective/"+course.key}>
                              <RaisedButton label="Objective" fullWidth={true} style={style.chip}  />
                            </Link>
                            <Link onClick={this.saveToLocalStorage(course)} to={"/practice/"+course.key}>
                              <RaisedButton label="Exam" fullWidth={true} style={style.chip} />
                            </Link>
                            <RaisedButton onClick={()=>this.writeAddCourses(course)} primary={true} label="Add To My Courses" fullWidth={true} style={style.chip} />
                          </div>
                        </div>
                    </div>
                  </div>
                </div> }/>
            </div>
        )}
        </div>
      )
    })
  }
  render () {
    return (
        <div className="col-sm-12">
          <br/>
           <ToastContainer />
          <div style={{marginTop:60}}></div>
          {
            (()=>{
            if (this.state.isloading){
              return this.spinner()
            }
            else if (this.state.noActivity) {
              return this.noActivity()
            }
            else {
              return this.showPageContent()
            }
          })()
        }
        </div>
      )
    }
  }
