import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import * as timestamp from '../auth/timestamp'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider'
import Delete from 'material-ui/svg-icons/action/delete'
import {Panel, Tooltip} from 'react-bootstrap'
import Remove from 'material-ui/svg-icons/content/delete-sweep';
const firebase = require('firebase')
const style = {
  chip: {
    margin: 4,
    backgroundColor:'#cfecf7',
  },
  paper:{
    textAlign: 'center',
    margin: 20,

  },
  height:50,
  textAlign: 'center',
};

export default class RecentActivities extends Component {
  constructor (props) {
    super (props)
    this.state = {
      activities:[],
      userId:'',
      loading: true,
      noActivities: false,
      next:false,
      current:0,
      counter:0,
    }
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.activitiesRef = firebase.database().ref().child('activities')
    this.increment = 14
    this.data = []
  }
  handleUser = (user) => {
    if (user){
      this.setState({userId:user.uid, username:user.displayName})
      this.readActivities(user.uid)
    }
  }
  async readActivities (userId) {
    this.activities = []
      await this.activitiesRef.child(userId).once('value', (snapshots)=>{
        if(!snapshots.exists())this.setState({noActivities:true, loading:false})
        snapshots.forEach((snapshot)=>{
          this.activities.push({
            key:snapshot.key,
            code:snapshot.val().code,
            title:snapshot.val().title,
            total:snapshot.val().total,
            score:snapshot.val().score,
            createdAt:snapshot.val().createdAt,
            Percentage:snapshot.val().percentage
          })
      })
    })
    await  this.activities.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
    this.showNextSet()
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.activities[i])
       this.setState({activities:this.data, loading:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
     if (this.state.counter + this.increment > this.activities.length-1){
       await this.setState({current:this.state.counter, counter:this.activities.length-1, next:false,})
     }else {
         await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
     }

     await this.getNextSet()
   }
  showPageContent (){
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <div style={{marginTop:60}}></div>
        {this.state.activities.map((activity) =>
          <Paper zDepth={3}>
            <Panel>
              <div className="card">
                <div className="card-header">
                  <h4><strong>{activity.title}<span style={{marginTop:-20}} className="pull-right text-center">{activity.code}&nbsp;&nbsp;
                    <IconButton tooltip="Remove" onClick={()=> this.handleDelete(activity.key)}>
                      <Remove />
                    </IconButton>
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
        <div className='col-sm-12 text-center'>
          {this.state.next && <RaisedButton className='text-center' label="Show More" primary={true} style={style.chip} onClick={()=>{this.showNextSet()}}/>}
        </div>
      </div>
    )
  }
  noActivities (){
    return (
      <div className='row text-center'>
        <div style={{marginTop:60}}></div>
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
        <div style={{marginTop:60}}></div>
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
