import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
import moment from 'moment'
import {Redirect} from 'react-router-dom'
import { BarChart } from 'react-easy-chart'
import * as TimeStamp from '../auth/timestamp'
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
const firebase =  require('firebase')

class Student extends Component {
  constructor(props){
    super (props)
    this.state ={
      userId:'',
      username:'',
      courseId:'',
    }
    this.userId = this.props.match.params.id
    this.courseId = this.props.match.params.courseId
    this.statRef = firebase.database().ref().child('student_stats')
    this.studentRef = firebase.database().ref().child('users')
    this.sessionRef = firebase.database().ref().child('sessions')
  }

  componentWillMount () {
     this.statRef.child(this.courseId).child(this.userId).once('value', (snapshots)=>{
        snapshots.forEach((snapshot)=>{
         this.setState({[snapshot.key]:snapshot.val()})
       })
     })

     this.studentRef.child(this.userId).once('value', (snapshot) =>{
       this.setState({displayName:snapshot.val().firstName + " " + snapshot.val().lastName, last_seen:snapshot.val().last_seen})
     })

     this.sessionRef.child(this.userId).once('value', (snapshots)=>{
        snapshots.forEach((date)=>{
         date.forEach((session)=>{
           console.log('Time:', session.val().time_difference)
         })
       })
     })

     this.sessionRef.child(this.userId).orderByKey().limitToLast(2).once('value', (snapshots)=>{
        snapshots.forEach((date)=>{
           console.log(moment(date.key).format('ddd MMM Do YYYY'))
       })
     })
   }

  mouseOverHandler = (d, e) => {
     var top = `${e.screenY - 10}px`
     var left =  `${e.screenX + 10}px`
   this.setState({
     showToolTip: true,
     top:top,
     left:left,
     y: d.y,
     x: d.x});
 }

 mouseMoveHandler = (e)=> {
   if (this.state.showToolTip) {
     this.setState({top: `${e.y - 10}px`, left: `${e.x + 10}px`});
   }
 }

 handleLogout (event) {
   firebase.auth().signOut().then(function() {
   }).catch(function(error) {
  // An error happened.
    });
      this.setState({redirect:true})
 }

 mouseOutHandler =() => {
   this.setState({showToolTip: false});
 }

  render() {
    return (
     this.state.redirect ? <Redirect to='/Login' push/> : <div className="App">
     <section id="STUDENT">
     <header className="App-header">
         <h1 className="App-title">FYE Class Analytics</h1>
         <button className='btn btn-danger pull-right' onClick={(event) => this.handleLogout(event)}>Sign Out</button>
     </header>
       <div class="container">
         <br/>

         <h3>Information for: {this.state.displayName}</h3>

         <div className="col-sm-10 col-sm-offset-1 ">

           <table className="table table-striped table-bordered bootstrap-datatable datatable">
     <thead>
       <tr>
         <th scope="col">#</th>
         <th scope="col">Student's Name</th>
         <th scope="col">Last Login</th>
         <th scope="col">Tests Started</th>
         <th scope="col">Tests completed</th>
         <th scope="col">Total Likes</th>
         <th scope="col">Total Comments</th>
         <th scope="col">Total Posts to Explore</th>
         <th scope="col"># of Tests started from Explore</th>
         <th scope="col"># of Bookmarked Questions</th>
       </tr>
     </thead>

     <tbody>
         <tr>
           <th scope="row">1</th>
           <td>{this.state.displayName}</td>
           <td>{TimeStamp.timeSince(this.state.last_seen)}</td>
           <td>{this.state.total_started}</td>
           <td>{this.state.total_completed}</td>
           <td>{this.state.likes}</td>
           <td>{this.state.total_comments}</td>
           <td>{this.state.explore_posts}</td>
           <td>{this.state.explore_origin}</td>
           <td>{this.state.total_bookmarked}</td>
         </tr>
     </tbody>
   </table>

         </div>

   </div>

     </section>

   <div>
   <br/>
   <br/>
   <BarChart
   axes
   grid
   colorBars
   axisLabels={{x: 'Session (Weekly)', y: 'Time (Sec)'}}
   yAxisOrientLeft
   //xDomainRange={['0', 'sessionDate']}
   //yDomainRange={[0, 5000]}
   //datePattern="%d-%b-%y %H:%M"
   height={250}
   width={550}
   margin={{top: 40, right: 50, bottom: 50, left: 60}}
   data={[
         { x: 'Monday', y: 20 },
         { x: 'Tuesday', y: 30 },
         { x: 'Wednesday', y: 40 },
         { x: 'Thursday', y: 30 },
         { x: 'Friday', y: 30 },
         { x: 'Saturday', y: 20 },
         { x: 'Sunday', y: 6 }
   ]}
   mouseOverHandler={this.mouseOverHandler}
   mouseOutHandler={this.mouseOutHandler}
   mouseMoveHandler={this.mouseMoveHandler}
 />

   </div>
     </div>);
  }
}

export default Student;
