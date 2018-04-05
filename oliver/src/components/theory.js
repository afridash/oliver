import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
const firebase = require('firebase')

export default class Theory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{},
      question:'Never mind',
      loading:true
    }
    this.courseId = this.props.match.params.id
    this.questionId = this.props.match.params.question
    this.questionsRef = firebase.database().ref().child('questions')
    this.getQuestion()
  }

  getQuestion (userId) {
    this.questionsRef.child(this.courseId).child(this.questionId).once('value', (notification) => {
      if (!notification.exists()) {
        this.setState({loading:false, noActivity:true})
        return null
      }
      this.item = {
        post:notification.val().question,
        createdAt: moment(),
        key:this.questionId,
        answer:notification.val().answer,
        code:notification.val().code,
        profilePicture:'',
        userId:this.courseId
      }
      this.setState({item:this.item, loading:false})
    })
  }
  spinner () {
     return (
       <div className='row text-center'>
         <div style={{marginTop:60}}></div>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
       </div>
     )
   }
  noActivity () {
     return (
       <div className='row text-center'>
         <div style={{marginTop:60}}></div>
         <div className='col-sm-6 col-sm-offset-3'>
           <br />  <br />
           <p className='text-info lead'>Item not found...</p>
           <Link to={"/AppHome"}>
             <RaisedButton label="Return Home" primary={true} fullWidth={true}/>
           </Link>
         </div>
         </div>
     )
   }
  render (){
    if (this.state.loading) {
     return this.spinner()
   }else if (this.state.noActivity) {
      return this.noActivity()
    }else return <Comments itemKey={this.questionId} userId={false} item={this.state.item} noCreatedAt={true} />
  }
}
