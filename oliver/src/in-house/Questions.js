import React, {Component} from 'react'
import {FormGroup, FormControl, ControlLabel, Col, Panel, Button, Checkbox, HelpBlock} from 'react-bootstrap'
import { EditorState, convertFromRaw, convertToRaw, ContentState} from 'draft-js'
import {Link} from 'react-router-dom'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
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
      editorState: EditorState.createEmpty(),
      answerState: EditorState.createEmpty(),
      optionAState: EditorState.createEmpty(),
      optionBState: EditorState.createEmpty(),
      optionCState: EditorState.createEmpty(),
      optionDState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState})
    this.onChangeAnswer = (answerState) => this.setState({answerState})
    this.onChangeAOption = (optionAState) => this.setState({optionAState})
    this.onChangeBOption = (optionBState) => this.setState({optionBState})
    this.onChangeCOption = (optionCState) => this.setState({optionCState})
    this.onChangeDOption = (optionDState) => this.setState({optionDState})
    this.questions = []
    this.courseKey = this.props.courseKey
    this.questionsRef = firebase.database().ref().child('questions')
    this.facultiesRef = firebase.database().ref().child('faculties')
    this.collegesRef = firebase.database().ref().child('colleges')
    this.departmentsRef = firebase.database().ref().child('departments')
    this.coursesRef = firebase.database().ref().child('courses')
    this.statsRef = firebase.database().ref().child('oliver_stats').child('questions')
  }
  setChecked (event) {
    this.setState({checked:event.target.checked})
  }
  onContentStateChange = (content) => {
    this.setState({question:draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))})
  }
  onContentStateChangeAnswer = (content) => {
    this.setState({answer:draftToHtml(convertToRaw(this.state.answerState.getCurrentContent()))})
  }
  onAChange = () => {
    this.setState({optionA:draftToHtml(convertToRaw(this.state.optionAState.getCurrentContent()))})
  }
  onBChange = () => {
      this.setState({optionB:draftToHtml(convertToRaw(this.state.optionBState.getCurrentContent()))})
  }
  onCChange = () => {
    this.setState({optionC:draftToHtml(convertToRaw(this.state.optionCState.getCurrentContent()))})
  }
  onDChange = () => {
    this.setState({optionD:draftToHtml(convertToRaw(this.state.optionDState.getCurrentContent()))})
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
    var blocksFromHtml = htmlToDraft(question.question)
    let editorState = null
    let answerState = null

    //Get the question stored in state as html
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({editorState})
    }
    //Get the answer stored as html
    blocksFromHtml = htmlToDraft(question.answer)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const answerState = EditorState.createWithContent(contentState)
      this.setState({answerState})
    }
    //Get option A as html from state
    blocksFromHtml = htmlToDraft(question.optionA)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionAState = EditorState.createWithContent(contentState)
      this.setState({optionAState})
    }
    //Get the second as stored in html
    blocksFromHtml = htmlToDraft(question.optionB)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionBState = EditorState.createWithContent(contentState)
      this.setState({optionBState})
    }
    //Option C
    blocksFromHtml = htmlToDraft(question.optionC)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionCState = EditorState.createWithContent(contentState)
      this.setState({optionCState})
    }
    //option D
    blocksFromHtml = htmlToDraft(question.optionD)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionDState = EditorState.createWithContent(contentState)
      this.setState({optionDState})
    }

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
    this.questions.forEach((question)=> this.uploadQuestion(question))
     this.statsRef.once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length)
    })
    this.collegesRef.child(this.props.college).child('questions').once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length)
    })
    this.facultiesRef.child(this.props.faculty).child('questions').once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length)
    })
    this.departmentsRef.child(this.props.department).child('questions').once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length)
    })
    this.coursesRef.child(this.props.department).child(this.props.courseKey).child('questions').once('value', (questions)=>{
      questions.ref.set(questions.val() + this.questions.length)
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
        uploaded:false,
        editorState:EditorState.createEmpty(),
        answerState:EditorState.createEmpty(),
        optionAState:EditorState.createEmpty(),
        optionBState: EditorState.createEmpty(),
        optionCState: EditorState.createEmpty(),
        optionDState: EditorState.createEmpty(),
      })
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
            <ControlLabel>Question</ControlLabel>
            <Editor
              editorClassName='form-control'
               editorState={this.state.editorState}
               toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
               placeholder='Enter Question'
               editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
               onEditorStateChange={this.onChange}
               onContentStateChange={this.onContentStateChange}
             />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            controlId="formBasicText"
            >
              <ControlLabel>Option A</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.optionAState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Option A'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChangeAOption}
                 onContentStateChange={this.onAChange}
               />

              <FormControl.Feedback />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Options B</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.optionBState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Option B'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChangeBOption}
                 onContentStateChange={this.onBChange}
               />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Options C</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.optionCState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Option C'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChangeCOption}
                 onContentStateChange={this.onCChange}
               />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Options D</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.optionDState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Option D'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChangeDOption}
                 onContentStateChange={this.onDChange}
               />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Answer (Option)</ControlLabel>
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
              <ControlLabel>Question</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.editorState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Question'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChange}
                 onContentStateChange={this.onContentStateChange}
               />
              <FormControl.Feedback />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Answer</ControlLabel>
              <Editor
                editorClassName='form-control'
                 editorState={this.state.answerState}
                 toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                 placeholder='Enter Answer'
                 editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                 onEditorStateChange={this.onChangeAnswer}
                 onContentStateChange={this.onContentStateChangeAnswer}
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
            {this.state.error !== '' && <p className='text-warning'>{this.state.error}</p>}
            <Button onClick={()=>this.showNext()} bsStyle='primary' style={{margin:10}} >Next</Button>
            {this.state.number > 0 && <Button onClick={()=>this.showPrevious()} bsStyle='default'>Previous</Button>}
            <div className='text-center'>
                <Link to={"/in-house/college/"+this.props.college+'/'+this.props.faculty+'/'+this.props.department}><Button bsStyle='danger' bsSize='small'>Back</Button></Link>
              {this.state.number > 0 && <Button onClick={()=>this.saveAssignment()}  bsStyle='success' style={{margin:10}}>Save</Button> }
            </div>
    </div>
    )
  }
  render () {
    return (
      this.state.submitted ? <div><p className='text-success'>Successfully Added Questions</p><Link to={"/in-house/college/"+this.props.college+'/'+this.props.faculty+'/'+this.props.department}><Button >Close</Button></Link></div> : this.showQuestionForm()
    )
  }
}
