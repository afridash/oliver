import React, {Component} from 'react'
import {FormControl, ControlLabel, FormGroup, Radio, Button, Glyphicon, Modal, Checkbox} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions:[],
      checkedAll:true,
      checkedAnswered:false,
      checkedUnanswered:false,
    }
    this.ref = firebase.database().ref().child('questions')
    this.courseKey = this.props.courseKey
    this.questions = []
  }
  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }
  filterAnsweredQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.answered === true
    })
    this.setState({questions:questions, checkedAnswered:true, checkedAll:false, checkedUnanswered:false})
  }
  filterUnansweredQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.answered === false
    })
    this.setState({questions:questions, checkedAnswered:false, checkedAll:false, checkedUnanswered:true})
  }
  filterAll () {
    this.setState({questions:this.questions, checkedAnswered:false, checkedAll:true, checkedUnanswered:false })
  }
  componentWillMount () {
    this.ref.child(this.courseKey).once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
          this.questions.push({
            question:snapshot.val().question,
            answer:snapshot.val().answer,
            optionA:snapshot.val().optionA,
            optionB:snapshot.val().optionB,
            optionC:snapshot.val().optionC,
            optionD:snapshot.val().optionD,
            key:snapshot.key,
            answered:snapshot.val().answered
            })
          this.setState({questions:this.questions})
      })
    })
  }
  setItems (q,k) {
    this.setState({showModal:true, question:q.question, answer:q.answer,index:k, key:q.key,
      optionA:q.optionA, optionB:q.optionB, optionC:q.optionC, optionD:q.optionD, answered:q.answered})
  }
  deleteQuestion (q,k) {
    this.ref.child(this.courseKey).child(q.key).remove()
    this.questions = this.questions.filter((question)=>{
      return question.key !== q.key
    })
    this.setState({questions:this.questions})
  }
  showMultipleChoice (q,k) {
    return (
      <div key={k} className="panel panel-info">
        <div className="panel-heading">
          <div className="caption">
            <div className="row">
              <div className="col-sm-11"><p>{k+1}</p></div>
              <div className="col-sm-1">
                <Glyphicon glyph="pencil" onClick={()=>this.setItems(q,k)} />&nbsp;&nbsp;
                <Glyphicon glyph="remove" onClick={()=>this.deleteQuestion(q,k)} style={{cursor:'pointer'}} />
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
  showModal () {
    return (
      <Modal show={this.state.showModal} onHide={()=>this.setState({showModal:false})}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Question</ControlLabel>
              <FormControl
                type="text"
                value={this.state.question}
                name="question"
                placeholder="Enter Question"
                onChange={(event)=>this.handleChange(event)}
              />

              <FormControl.Feedback />
            </FormGroup>
            <FormGroup
              controlId="formBasicText"
              >
                <ControlLabel>Answer</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.answer}
                  name="answer"
                  placeholder="Enter Answer"
                  onChange={(event)=>this.handleChange(event)}
                />

                <FormControl.Feedback />
              </FormGroup>

              <FormGroup
                controlId="formBasicText"
                >
                  <ControlLabel>Option A</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.optionA}
                    name="optionA"
                    placeholder="Enter Option A"
                    onChange={(event)=>this.handleChange(event)}
                  />

                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="formBasicText"
                  >
                    <ControlLabel>Option B</ControlLabel>
                    <FormControl
                      type="text"
                      value={this.state.optionB}
                      name="optionB"
                      placeholder="Enter Answer"
                      onChange={(event)=>this.handleChange(event)}
                    />

                    <FormControl.Feedback />
                  </FormGroup>

                  <FormGroup
                    controlId="formBasicText"
                    >
                      <ControlLabel>Option C</ControlLabel>
                      <FormControl
                        type="text"
                        value={this.state.optionC}
                        name="optionC"
                        placeholder="Enter Answer"
                        onChange={(event)=>this.handleChange(event)}
                      />

                      <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                      controlId="formBasicText"
                      >
                        <ControlLabel>Option D</ControlLabel>
                        <FormControl
                          type="text"
                          value={this.state.optionD}
                          name="optionD"
                          placeholder="Enter Answer"
                          onChange={(event)=>this.handleChange(event)}
                        />

                        <FormControl.Feedback />
                      </FormGroup>
                      <Checkbox checked={this.state.answered} onChange={(event)=>this.setState({answered:!this.state.answered})}>Answered</Checkbox>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.saveQuestion()}>Save</Button>
          <Button onClick={()=>this.setState({showModal:false})}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  saveQuestion () {
    var data = {}
      data = {
      question:this.state.question,
      answer:this.state.answer,
      answered:this.state.answered,
      optionA:this.state.optionA,
      optionB:this.state.optionB,
      optionC:this.state.optionC,
      optionD:this.state.optionD
      }
    this.ref.child(this.courseKey).child(this.state.key).update(data)
    var clone = this.state.questions
    clone[this.state.index] = data
    this.questions[this.state.index] = data
    this.setState({
      questions:clone,
       answer:'',
       answered:false,
       question:'',
       key:'',
       index:'',
       optionD:'',
       optionC:'',
       optionB:'',
       optionA:'',
       showModal:false})
  }
  render () {
    return (
      <div>
        <div className='text-center'>
        <FormGroup>
          <Radio onChange={()=>this.filterAll()} checked={this.state.checkedAll} name="radioGroup" inline> All</Radio> {' '}
          <Radio onChange={()=>this.filterAnsweredQuestions()} checked={this.state.checkedAnswered} name="radioGroup" inline>Answered</Radio> {' '}
          <Radio onChange={()=>this.filterUnansweredQuestions()} checked={this.state.checkedUnanswered} name="radioGroup" inline>Unanswered</Radio>
        </FormGroup>
        </div>
        {this.state.questions.map((question, key)=>
          this.showMultipleChoice(question, key)
        )}
        <Button bsStyle='primary'  className='text-center' onClick={this.props.close}>Close</Button>
        {this.showModal()}
      </div>
    )
  }
}
