import React, {Component} from 'react'
import {Firebase} from '../auth/firebase'
import Comments from './comments'
import moment from 'moment'
const firebase = require('firebase')

export default class Theory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item:{},
      question:'Never mind'
    }
    this.courseId = this.props.match.params.id
    this.questionId = this.props.match.params.question
    this.questionsRef = firebase.database().ref().child('questions')
    this.getQuestion()
  }

  getQuestion (userId) {
    this.questionsRef.child(this.courseId).child(this.questionId).once('value', (notification) => {
      this.item = {
        post:notification.val().question,
        createdAt: moment(),
      }
      this.setState({item:this.item})
    })
  }
  render (){
    return <Comments item={this.state.item} noCreatedAt={true} />
  }
}
