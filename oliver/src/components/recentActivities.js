import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import * as timestamp from '../auth/timestamp'
const firebase = require('firebase')

class RecentActivities extends Component {
  constructor (props) {
    super (props)
    this.state = {
      activities:[],
      userId:'',
    }
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.activitiesRef = firebase.database().ref().child('activities')

  }

  handleUser = (user) => {
    if (user){
      this.setState({userId:user.uid, username:user.displayName})
      this.recentActivities(user.uid)
    }
  }

  recentActivities (userId) {
   this.activitiesRef.child(userId).once('value', (snapshots)=>{
    this.activities = []
    snapshots.forEach((snapshot)=>{
      this.activities.push({key:snapshot.key, code:snapshot.val().code, title:snapshot.val().title, total:snapshot.val().total,
              score:snapshot.val().score, createdAt:snapshot.val().createdAt, Percentage:snapshot.val().percentage})
      this.setState({activities:this.activities})

      })
    })
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
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            {this.state.activities.map((activity) =>
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h4>{activity.title}<span className="pull-right">{activity.code}
                    <span className="btn btn-danger btn-sm" onClick={()=> this.handleDelete(activity.key)}>
                    <i className="fa fa-trash-o fa-lg"></i> Delete</span>
                  </span></h4>
                </div>
                <div className="panel-body">
                    <h4>Score: {activity.score} out of {activity.total}</h4>
                    <h4>Percentage: {activity.Percentage}%</h4>
                </div>
                <div className="panel-footer">{timestamp.timeSince(activity.createdAt)}</div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}

export default RecentActivities;
