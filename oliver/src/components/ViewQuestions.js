import React, {Component} from 'react'
import {FormGroup, FormControl, ControlLabel, Col, Panel, Button, Checkbox, HelpBlock} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions:[]
    }
    this.ref = firebase.database().ref().child('questions')
    this.courseKey = this.props.courseKey
    this.questions = []
  }
  componentWillMount () {
    this.ref.child(this.courseKey).once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
          this.questions.push(snapshot.val())
          this.setState({questions:this.questions})
      })
    })
  }
  showMultipleChoice (q,k) {
    return (
      <div key={k} className="panel panel-info">
        <div className="panel-heading">
          <div className="caption">
            <div className="row">
              <div className="col-sm-11"><p>{k+1}</p></div>
              <div className="col-sm-1">
                <a href="#editQuestion" data-toggle="modal"><span className="fa fa-pencil fa-2x" onClick={()=>this.setItems(q,k)}></span></a>&nbsp;&nbsp;
                <span style={{cursor:'pointer'}} className="fa fa-times fa-2x" onClick={()=>this.deleteQuestion(q,k)}></span>
              </div>
            </div>
          </div>
        </div>
        <div id="1" className="panel-body">
          <p style={{fontSize:18}}>{q.question}</p>
          <p style={{fontSize:14}}>Answer: {q.answer}</p>
        </div>
        <div className="panel-footer">
          <div className="row">
            <div className="col-sm-3"><p>A: {q.optionA}</p></div>
            <div className="col-sm-3"><p>B: {q.optionB}</p></div>
            <div className="col-sm-3"><p>C: {q.optionC}</p></div>
            <div className="col-sm-3"><p>D: {q.optionD}</p></div>
          </div>
        </div>
      </div>
    )
  }
  render () {
    return (
      <div>
        {this.state.questions.map((question, key)=>
          this.showMultipleChoice(question, key)
        )}
        <Button bsStyle='primary'  className='text-center' onClick={this.props.close}>Close</Button>
      </div>
    )
  }
}
