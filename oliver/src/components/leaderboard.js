import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router-dom'
import {Firebase} from '../auth/firebase'
import CircularProgress from 'material-ui/CircularProgress'
const firebase = require('firebase')
export default class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leaders:[],
      next:false,
      current:0,
      counter:0,
      loading:true,
      noActivity:false,
    }
    this.userStats = firebase.database().ref().child('user_stats')
    this.usersRef = firebase.database().ref().child('users')
    this.increment = 19
    this.data = []
    this.leaders = []
  }
  async componentWillMount () {
    await this.userStats.orderByChild('points').limitToLast(100).once('value', async (leaders)=> {
      var count = Object.keys(leaders.val()).length
      if (!leaders.exists()) this.setState({loading:false, noActivity:true})
      var index = 0
      leaders.forEach((leader)=> {
        this.usersRef.child(leader.key).once('value', (user)=> {
          this.leaders.unshift({points:leader.val().points, completed:leader.val().completed, displayName:user.val().displayName, username:user.val().username, college:user.val().college})
          this.leaders.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
          index++
          if (index === count) {
            this.showNextSet()
          }
        })
      })
    })
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.leaders[i])
       this.setState({leaders:this.data, loading:false, noActivity:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
     if (this.state.counter + this.increment >= this.leaders.length-1){
       await this.setState({current:this.state.counter, counter:this.leaders.length-1, next:false,})
     }else {
         await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
     }
     await this.getNextSet()
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
  noActivity () {
    return  (
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p className='text-info lead'>Leaderboard has not been populated</p>
          <Link to={"/dashboard"}>
            <RaisedButton label="Return Home" secondary={true} fullWidth={true} />
          </Link>
        </div>
        </div>
    )
  }
  showPageContent () {
    return (
      <div className='col-sm-10 col-sm-offset-1'>
        <div className='text-center'>
          <h2 className='text-info lead'>LEADERBOARD</h2>
        </div>
        <div className='col-sm-12'>
          <table className="table table-hover" id="dataTables-example">
            <thead className="text-info">
              <tr>
                <th>Ranking</th>
                <th className='hidden-xs'>Name</th>
                <th>Username</th>
                <th>University</th>
                <th>Completed Sessions</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {this.state.leaders.map((leader, key)=>
                <tr>
                  <td>{key + 1}</td>
                  <td className='hidden-xs'>{leader.displayName}</td>
                  <td>{leader.username}</td>
                  <td>{leader.college}</td>
                  <td>{leader.completed}</td>
                  <td>{leader.points}</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className='row'>
        <div style={{marginTop:100}}></div>
        {(()=>{
          if (this.state.loading)
          return this.spinner()
          else if (this.state.noActivity)
          return this.noActivity()
          else return this.showPageContent()
        })()}
        <div className='col-sm-12 text-center'>
          {this.state.next && <RaisedButton className='text-center' label="Show More" primary={true} onClick={()=>{this.showNextSet()}}/>}
        </div>
      </div>
    )
  }
}
