import React, {Component} from 'react'
import {FormGroup, FormControl, ControlLabel, Col, Panel, Button, Checkbox, HelpBlock} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked:false,
      number:0,
      error:'',
      question:'',
      answer:'',
      optionA:'',
      optionB:'',
      optionC:'',
      optionD:'',
      questionType:'objective',
    }
    this.questions = []
    this.courseKey = this.props.courseKey
    this.questionsRef = firebase.database().ref().child('questions')
    this.statsRef = firebase.database().ref().child('questions')
  }
  setChecked (event) {
    this.setState({checked:event.target.checked})
  }
  showNext () {
    if (this.state.number < this.questions.length-1) {
      if(this.saveQuestion()){
        this.setState({number:this.state.number +=1 })
        this.showQuestion(this.state.number)
      }
    }
    else {
      if (this.saveQuestion()) this.setState({number:this.state.number +=1})
    }
  }
  showPrevious () {
    if (this.state.question !== '') {
      if (this.saveQuestion()){
        this.setState({number:this.state.number -=1 })
        this.showQuestion(this.state.number)
      }
    }else {
      this.setState({number:this.state.number -=1 })
      this.showQuestion(this.state.number)
    }
  }
  handleChange (event) {
    this.setState({[event.target.name] : event.target.value})
  }
  showQuestion (number) {
    var question = this.questions[number]
      this.setState({
        type:question.type,
        optionA:question.optionA,
        optionB:question.optionB,
        optionC:question.optionC,
        optionD:question.optionD,
        answer:question.answer,
        checked:question.answered,
        question:question.question,
      })
  }
  async saveAssignment () {
    var result = false
    if(this.state.question !== '') {
      result = this.saveQuestion()
      if (result) this._saveAssignment()
    }else {
      this._saveAssignment()
    }
  }
  _saveAssignment () {
    this.questions.filter((question)=> this.uploadQuestion(question))
    var ref = this.statsRef.once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length-1)
    })
    this.setState({submitted:true})
  }
  async uploadQuestion (question) {
    this.questionsRef.child(this.courseKey).push(question)
  }
  saveQuestion () {
    var data = {}
    var isOk = this.authenticateQuestion()
    if (isOk) {
      if (this.state.questionType === 'objective') {
        data = {
          type:this.state.questionType,
          answered:this.state.checked,
          question:this.state.question,
          optionA:this.state.optionA,
          optionB:this.state.optionB,
          optionC:this.state.optionC,
          optionD:this.state.optionD,
          answer:this.state.answer,
        }
      }else {
        data = {
          type:this.state.questionType,
          answered:this.state.checked,
          question:this.state.question,
          answer:this.state.answer,
        }
      }

      this.questions[this.state.number] = data
      this.setState({
        error:'',
        optionA:'',
        optionB:'',
        optionC:'',
        optionD:'',
        answer:'',
        question:'',
        checked:false,
        uploaded:false,})
      return true
    }else {
      this.setState({error: "Question/Answers fields cannot be empty"})
      return false
    }
  }
  authenticateQuestion () {
    if (this.state.questionType === 'objective') {
      if (this.state.question === '' || this.state.optionA === ''
      ||this.state.optionB === '' || this.state.optionC === '' || this.state.optionD === '') return false
      else return true
    }else {
      if (this.state.question === '') return false
      else return true
    }
  }
  showQuestions () {
    if (this.state.questionType === 'objective') return this.showObjectivesForm()
    else if (this.state.questionType === 'theory') return this.showTheoryForm()
    else return this.showChooseQuestiontType()
  }
  showObjectivesForm () {
    return (
      <div>
        <FormGroup
          controlId="formBasicText"
          >
            <textarea
              className='form-control'
              style={{resize:'none'}}
              type="text"
              value={this.state.question}
              name="question"
              placeholder="Enter Question"
              onChange={(event)=>this.handleChange(event)} />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Enter Options Below</ControlLabel>
              <FormControl
                type="text"
                value={this.state.optionA}
                name="optionA"
                placeholder="Option A"
                onChange={(event)=>this.handleChange(event)}
              />

              <FormControl.Feedback />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                value={this.state.optionB}
                name="optionB"
                placeholder="Option B"
                onChange={(event)=>this.handleChange(event)}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                value={this.state.optionC}
                name="optionC"
                placeholder="Option C"
                onChange={(event)=>this.handleChange(event)}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                value={this.state.optionD}
                name="optionD"
                placeholder="Option D"
                onChange={(event)=>this.handleChange(event)}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                value={this.state.answer}
                name="answer"
                placeholder="Answer (Option)"
                onChange={(event)=>this.handleChange(event)}
              />
              <HelpBlock>Enter the correct option</HelpBlock>
            </FormGroup>
          </div>
        )
  }
  showTheoryForm () {
      return (
        <div>
          <FormGroup
            controlId="formBasicText"
            >
              <textarea
                className='form-control'
                style={{resize:'none'}}
                type="text"
                value={this.state.question}
                name="question"
                placeholder="Enter Question"
                onChange={(event)=>this.handleChange(event)} />
              <FormControl.Feedback />
            </FormGroup>

            <FormGroup>
              <FormControl
                type="text"
                value={this.state.answer}
                name="answer"
                placeholder="Answer (Option)"
                onChange={(event)=>this.handleChange(event)}
              />
              <HelpBlock>Enter the correct option</HelpBlock>
            </FormGroup>
        </div>
      )
  }
  showChooseQuestiontType () {
    return (
      <div className='text-center'><h3>Choose A Question Type To Add New Question</h3></div>
    )
  }
  showQuestionForm () {
    return (
      <div>
        <h3 className="text-center">{this.state.number+1}</h3>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Select Question Type</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="Choose Type"
            name='questionType'
            onChange={(event)=>this.handleChange(event)}
            >
            <option value="objective">Objective</option>
            <option value="theory">Theory</option>
          </FormControl>
        </FormGroup>
            {this.showQuestions()}
            <Checkbox checked={this.state.checked} onChange={(event)=>this.setChecked(event)}>Answered</Checkbox>
            {this.state.error !== '' ? <p className='text-warning'>{this.state.error}</p> :<p></p>}
            <Button onClick={()=>this.showNext()} bsStyle='primary' style={{margin:10}} >Next</Button>
            {this.state.number > 0 ? <Button onClick={()=>this.showPrevious()} bsStyle='default'>Previous</Button> : <div></div>  }
            <div className='text-center'>
              <Button  bsStyle='danger' onClick={this.props.close}>Close</Button>
              {this.state.number > 0 ? <Button onClick={()=>this.saveAssignment()}  bsStyle='success' style={{margin:10}}>Save</Button> : <div></div>  }
            </div>
    </div>
    )
  }
  render () {
    return (
      this.state.submitted ? <div><p className='text-success'>Successfully Added Questions</p><Button onClick={this.props.close}>Close</Button></div> : this.showQuestionForm()
    )
  }
}
