import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import * as timestamp from '../auth/timestamp'
import {Link, Redirect} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import Delete from 'material-ui/svg-icons/action/delete'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap'
const firebase = require('firebase')

const tooltip = (
  <Tooltip id="tooltip">Delete</Tooltip>
);

export default class RecentActivities extends Component {
  constructor (props) {
    super (props)
    this.state = {
      activities:[],
      userId:'',
      loading: true,
      noActivities: false,
    }
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.activitiesRef = firebase.database().ref().child('activities')
  }
  handleUser = (user) => {
    if (user){
      this.setState({userId:user.uid, username:user.displayName})
      this.readActivities(user.uid)
    }
  }
  readActivities (userId) {
    this.activities = []
      this.activitiesRef.child(userId).once('value', (snapshots)=>{
        if(!snapshots.exists())this.setState({noActivities:true, loading:false})
        snapshots.forEach((snapshot)=>{
          this.activities.push({key:snapshot.key, code:snapshot.val().code, title:snapshot.val().title, total:snapshot.val().total,
              score:snapshot.val().score, createdAt:snapshot.val().createdAt, Percentage:snapshot.val().percentage})
      this.setState({activities:this.activities, loading:false})

      })
    })
  }
  showPageContent (){
    return (
      <div className="col-sm-8 col-sm-offset-2">
        {this.state.activities.map((activity) =>
          <Paper zDepth={3}>
            <Panel>
              <div className="card">
                <div className="card-header">
                  <h4><strong>{activity.title}<span className="pull-right">{activity.code}&nbsp;&nbsp;
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                      <i className="fa fa-trash-o fa-lg" style={{cursor:'pointer'}} onClick={()=> this.handleDelete(activity.key)}></i>
                    </OverlayTrigger>
                  </span></strong></h4>
                </div>
                <Divider/>
                <div className="card card-body">
                  <br/>
                  <h4>Score: {activity.score} out of {activity.total}</h4>
                  <h4>Percentage: {activity.Percentage}%</h4>
                </div>
                <div className="card-footer">
                  <span className="pull-right">{timestamp.timeSince(activity.createdAt)}</span>
                </div>
              </div>
            </Panel>
          </Paper>
        )}

      </div>
    )
  }
  noActivities (){
    return (
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p className='text-info lead'>No Recent Activities</p>
        </div>
        </div>
    )
  }
  spinner () {
    return (
      <div className="row text-center">
        <div className="col-md-6 col-md-offset-3">
          <br/>
          <br/>
          <CircularProgress size={60} thickness={5} />
        </div>
      </div>
    )
  }
  handleDelete (key) {
    //Delete entry with userId and key of entry
   this.activitiesRef.child(this.state.userId).child(key).remove()
   //Filter activities and return items whose key is not equal to item deleted
   this.activities = this.activities.filter ((activity)=> activity.key !== key)
   //update state with remaining items
   this.setState({activities:this.activities})
   }
  render(){
    return(
      <div className="center">
        <br/>
        <div className="row">
          {
            (()=>{
              if (this.state.loading){
                return this.spinner()
              }
              else if (this.state.noActivities) {
                return this.noActivities()
              }
              else {
                return this.showPageContent()
              }
            })()
          }
        </div>
      </div>
    );
  }
}
