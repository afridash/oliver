import React, {Component} from 'react'
import {FormControl, ControlLabel, FormGroup, Radio, Button, Glyphicon, Modal, Checkbox} from 'react-bootstrap'
import {Firebase} from '../auth/firebase'
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js'
import {Link} from 'react-router-dom'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
const firebase =  require('firebase')
export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions:[],
      checkedAll:true,
      checkedAnswered:false,
      checkedUnanswered:false,
      checkedObjectives:false,
      checkedTheoryQuestions:false,
      editorState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState})
    this.onChangeAnswer = (answerState) => this.setState({answerState})
    this.onChangeAOption = (optionAState) => this.setState({optionAState})
    this.onChangeBOption = (optionBState) => this.setState({optionBState})
    this.onChangeCOption = (optionCState) => this.setState({optionCState})
    this.onChangeDOption = (optionDState) => this.setState({optionDState})
    this.ref = firebase.database().ref().child('questions')
    this.courseKey = this.props.courseKey
    this.questions = []
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
  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }
  filterAnsweredQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.answered === true
    })
    this.setState({questions:questions, checkedAnswered:true, checkedAll:false, checkedUnanswered:false, checkedTheoryQuestions:false, checkedObjectives:false})
  }
  filterUnansweredQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.answered === false
    })
    this.setState({questions:questions, checkedAnswered:false, checkedAll:false, checkedUnanswered:true, checkedTheoryQuestions:false, checkedObjectives:false})
  }
  filterAll () {
    this.setState({questions:this.questions, checkedAnswered:false, checkedAll:true, checkedUnanswered:false })
  }
  filterTheoryQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.type === 'theory'
    })
    this.setState({questions:questions, checkedAnswered:false, checkedAll:false, checkedUnanswered:false, checkedTheoryQuestions:true, checkedObjectives:false})
  }
  filterObjectiveQuestions () {
    var clone = this.questions
    var questions = clone.filter((question)=>{
      return question.type === 'objective'
    })
    this.setState({questions:questions, checkedAnswered:false, checkedAll:false, checkedUnanswered:false, checkedTheoryQuestions:false, checkedObjectives:true})
  }
  componentWillMount () {
    this.ref.child(this.courseKey).once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
        if (snapshot.val().type === 'objective') {
          this.questions.push({
            question: "<p>" + snapshot.val().question + "</p>",
            answer: snapshot.val().answer,
            optionA: "<p>" + snapshot.val().optionA + "</p>",
            optionB: "<p>" + snapshot.val().optionB + "</p>",
            optionC: "<p>" + snapshot.val().optionC + "</p>",
            optionD: "<p>" + snapshot.val().optionD + "</p>",
            key:snapshot.key,
            answered: snapshot.val().answered,
            type:snapshot.val().type
            })
        } else {
          this.questions.push({
            question:"<p>" + snapshot.val().question + "</p>",
            answer: "<p> Answer: " + snapshot.val().answer + "</p>",
            key:snapshot.key,
            answered:snapshot.val().answered,
            type:snapshot.val().type
            })
        }
          this.setState({questions:this.questions})
      })
    })
  }
  setItems (q,k) {
    var blocksFromHtml = htmlToDraft(q.question)
    let editorState = null
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({editorState})
    }

    //Get the answer stored as html
    blocksFromHtml = htmlToDraft(q.answer)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const answerState = EditorState.createWithContent(contentState)
      this.setState({answerState})
    }
    //Get option A as html from state
    blocksFromHtml = htmlToDraft(q.optionA)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionAState = EditorState.createWithContent(contentState)
      this.setState({optionAState})
    }
    //Get the second as stored in html
    blocksFromHtml = htmlToDraft(q.optionB)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionBState = EditorState.createWithContent(contentState)
      this.setState({optionBState})
    }
    //Option C
    blocksFromHtml = htmlToDraft(q.optionC)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionCState = EditorState.createWithContent(contentState)
      this.setState({optionCState})
    }
    //option D
    blocksFromHtml = htmlToDraft(q.optionD)
    if (blocksFromHtml) {
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
      const optionDState = EditorState.createWithContent(contentState)
      this.setState({optionDState})
    }
    if (q.type === 'objective') {
      this.setState({showModal:true,
        question:q.question,
        answer:q.answer,
        index:k,
        key:q.key,
        optionA:q.optionA,
        optionB:q.optionB,
        optionC:q.optionC,
        optionD:q.optionD,
        answered:q.answered,
        type:q.type})
    }else {
      this.setState({
        showModalTheory:true,
        question:q.question,
        answer:q.answer,
        index:k,
        key:q.key,
        answered:q.answered,
        type:q.type})
    }
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
          <div style={{fontSize:18}} dangerouslySetInnerHTML={{__html: q.question}}></div>
          <p style={{fontSize:14}}>Answer: {q.answer}</p>
        </div>
        <div className="panel-footer">
          <div className="row">
            <div className="col-sm-3">
              <span className='pull-left'>A: </span>
              <p style={{fontSize:14}} dangerouslySetInnerHTML={{__html: q.optionA}}></p>
            </div>
            <div className="col-sm-3">
                <span className='pull-left'>B: </span>
            <p style={{fontSize:14}} dangerouslySetInnerHTML={{__html: q.optionB}}></p>
            </div>
            <div className="col-sm-3">
              <span className='pull-left'>C: </span>
              <p style={{fontSize:14}} dangerouslySetInnerHTML={{__html: q.optionC}}></p>
            </div>
            <div className="col-sm-3">
              <span className='pull-left'>D: </span>
              <p style={{fontSize:14}} dangerouslySetInnerHTML={{__html: q.optionD}}></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  showTheory (q,k) {
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
          <div style={{fontSize:18}} dangerouslySetInnerHTML={{__html: q.question}}></div>
          <p style={{fontSize:14}} dangerouslySetInnerHTML={{__html: q.answer}}></p>
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
              <Editor
                 editorState={this.state.editorState}
                 editorClassName='form-control'
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

                <FormGroup
                  controlId="formBasicText"
                  >
                    <ControlLabel>Option B</ControlLabel>
                    <Editor
                      editorClassName='form-control'
                       editorState={this.state.optionBState}
                       toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                       placeholder='Enter Option B'
                       editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                       onEditorStateChange={this.onChangeBOption}
                       onContentStateChange={this.onBChange}
                     />

                    <FormControl.Feedback />
                  </FormGroup>

                  <FormGroup
                    controlId="formBasicText"
                    >
                      <ControlLabel>Option C</ControlLabel>
                      <Editor
                        editorClassName='form-control'
                         editorState={this.state.optionCState}
                         toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                         placeholder='Enter Option C'
                         editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                         onEditorStateChange={this.onChangeCOption}
                         onContentStateChange={this.onCChange}
                       />

                      <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                      controlId="formBasicText"
                      >
                        <ControlLabel>Option D</ControlLabel>
                        <Editor
                          editorClassName='form-control'
                           editorState={this.state.optionDState}
                           toolbarStyle={{backgroundColor:'white', borderWidth:1, borderColor:'lightgrey'}}
                           placeholder='Enter Option D'
                           editorStyle={{backgroundColor:'white', height:100, borderWidth:1, borderColor:'lightgrey', padding:5}}
                           onEditorStateChange={this.onChangeDOption}
                           onContentStateChange={this.onDChange}
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
  showModalTheory () {
    return (
      <Modal show={this.state.showModalTheory} onHide={()=>this.setState({showModalTheory:false})}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <FormControl.Feedback />
              </FormGroup>
              <Checkbox checked={this.state.answered} onChange={(event)=>this.setState({answered:!this.state.answered})}>Answered</Checkbox>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.saveQuestion()}>Save</Button>
          <Button onClick={()=>this.setState({showModalTheory:false})}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  saveQuestion () {
    var data = {}
    if (this.state.type === 'objective') {
      data = {
      question:this.state.question,
      answer:this.state.answer,
      answered:this.state.answered,
      optionA:this.state.optionA,
      optionB:this.state.optionB,
      optionC:this.state.optionC,
      optionD:this.state.optionD,
      type:this.state.type
      }
    } else {
      data = {
      question:this.state.question,
      answer:this.state.answer,
      answered:this.state.answered,
      type:this.state.type,
      }
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
       showModal:false,
       showModalTheory:false})
  }
  render () {
    return (
      <div>
        <div className='text-center'>
        <FormGroup>
          <Radio onChange={()=>this.filterAll()} checked={this.state.checkedAll} name="radioGroup" inline> All</Radio> {' '}
          <Radio onChange={()=>this.filterAnsweredQuestions()} checked={this.state.checkedAnswered} name="radioGroup" inline>Answered</Radio> {' '}
          <Radio onChange={()=>this.filterUnansweredQuestions()} checked={this.state.checkedUnanswered} name="radioGroup" inline>Unanswered</Radio> {' '}
          <Radio onChange={()=>this.filterTheoryQuestions()} checked={this.state.checkedTheoryQuestions} name="radioGroup" inline>Theories</Radio> {' '}
          <Radio onChange={()=>this.filterObjectiveQuestions()} checked={this.state.checkedObjectives} name="radioGroup" inline>Objectives</Radio>
        </FormGroup>
        </div>
        {this.state.questions.map((question, key)=>
          question.type === 'objective' ? this.showMultipleChoice(question, key) : this.showTheory(question, key)
        )}
        <Link to={"/in-house/college/"+this.props.college+'/'+this.props.faculty+'/'+this.props.department}>
          <Button bsStyle='primary'  className='text-center' onClick={this.props.close}>Close</Button>
        </Link>
        {this.showModal()}
        {this.showModalTheory()}
      </div>
    )
  }
}
