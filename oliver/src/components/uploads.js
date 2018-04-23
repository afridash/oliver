import React, {Component} from 'react'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {Link} from 'react-router-dom'
import FileReaderInput from 'react-file-reader-input'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'
import Firebase from '../auth/firebase'
import TextField from 'material-ui/TextField'
import * as timestamp from '../auth/timestamp'
import IconButton from 'material-ui/IconButton'
import Arrow from 'material-ui/svg-icons/navigation/expand-more'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {
  blue300,
} from 'material-ui/styles/colors'
const firebase = require('firebase')

export default class Uploads extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading:true,
      uploads:[],
      uploadedImages:[],
      course:'',
      university:'',
    }
    this.uploads = []
    this.uploadedImages = []
    this.uploadsRef = firebase.database().ref().child('uploaded_questions')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {
      this.setState({userId:user.uid, displayName:user.displayName, photoURL:user.photoURL})
      this.retrieveUploaded(user.uid)
    }
  }
  retrieveUploaded (userId) {
    this.uploadsRef.child(userId).once('value', (images)=> {
      if (!images.exists()) this.setState({loading:false, noUploads:true})
      else{
        images.forEach((image)=> {
          this.uploads.push({
            key:image.key,
            attachments:image.val().attachments,
            createdAt:image.val().createdAt,
            course:image.val().course,
            university:image.val().university})
        })
        this.setState({uploads:this.uploads, loading:false, noUploads:false})
      }
    })
  }
  handleFileInput = (e, results) => {
    results.forEach(result => {
      const [e, file] = result
      this.uploadedImages.push({attachment:e.target.result, mime:file.type, name:file.name})
      this.setState({uploadedImages:this.uploadedImages, startUpload:true})
    })
  }
  handleOpen = () => {
    this.setState({open: true});
  }
  handleClose = () => {
    this.setState({open: false, uploadedImages:[], startUpload:false})
    this.uploadedImages = []
  }
  handleTextChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  handleClick (event, upload) {
    this.setState({
      openComment: true,
      anchorComment: event.currentTarget,
      deleteKey: upload.key,
      files:upload.attachments
    })
  }
  async deletePost () {
    await this.state.files.forEach((image)=> {
      var ref = firebase.storage().ref().child('uploaded_questions').child('uploads').child(image.name)
      // Delete the file
      ref.delete().then(function() {
      // File deleted successfully
      }).catch(function(error) {
      // Uh-oh, an error occurred!
      });
    })
    this.uploadsRef.child(this.state.userId).child(this.state.deleteKey).remove()
    this.uploads = this.uploads.filter((upload)=> upload.key !== this.state.deleteKey)
    if (this.uploads.length > 0)
      this.setState({uploads:this.uploads})
    else this.setState({noUploads:true, uploads:[]})

    this.handleRequestClose()
  }
  handleRequestClose = () => {
   this.setState({
     open: false,
     openComment:false,
   })
  }
  removeImage (index) {
    this.uploadedImages.splice(index,1)
    this.setState({uploadedImages:this.uploadedImages})
    if (this.uploadedImages.length <= 0) this.setState({startUpload:false})
  }
  authenticateData () {
    return this.state.uploadedImages.length !==0 && this.state.university !== '' && this.state.course !== ''
  }
  uploadQuestions () {
    if (this.authenticateData()) {
      var downloadUrls = []
      this.setState({uploadingImages:true})

      this.state.uploadedImages.forEach((image)=> {
        var ref = firebase.storage().ref().child('uploaded_questions').child('uploads').child(image.name)
        var uploadTask = ref.putString(image.attachment, 'data_url')
        uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({width:progress.toFixed(0)})
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
          default: break;
        }
        }, function(error) {
        // Handle unsuccessful uploads
        }, (success) => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          var downloadURL = uploadTask.snapshot.downloadURL;
          downloadUrls.push({name:image.name, mime:image.mime, downloadURL:downloadURL})
          if (downloadUrls.length === this.state.uploadedImages.length) {
            this.saveUpload(downloadUrls)
          }
        })
      })
    }
  }
  saveUpload (downloadUrls) {
    var data = {
      course:this.state.course,
      university:this.state.university,
      attachments:downloadUrls,
      createdAt:firebase.database.ServerValue.TIMESTAMP
    }
    var item = this.uploadsRef.child(this.state.userId).push()
    var key = item.key
    item.setWithPriority(data, 0 - Date.now()).then(()=>{
        data['key'] = key
        this.uploads.unshift(data)
        this.setState({uploads:this.uploads, uploadingImages:false, noUploads:false})
        this.handleClose()
    })
  }
  spinner () {
    return (
      <div className='row text-center'>
          <br />  <br />
          <CircularProgress size={60} thickness={5} />
      </div>
    )
  }
  noActivity () {
    return (
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p className='text-info lead'>You Have No Uploads</p>
           <RaisedButton onClick={this.handleOpen} label="New Upload" secondary={true} buttonStyle={{backgroundColor:blue300}} />
        </div>
        </div>
    )
  }
  showPageContent () {
    return(
      <div className='col-sm-10 col-sm-offset-1'>
        <div className='text-center' style={{margin:10}}>
          <RaisedButton onClick={this.handleOpen} label="New Upload" secondary={true} buttonStyle={{backgroundColor:blue300}} />
        </div>
      {this.state.uploads.map((upload)=>
        <Paper zDepth={3} rounded={true} >
          <div style={{margin:10, padding:10}}>
            <p className='lead text-center'>{upload.university} ({upload.course})
              <span className="pull-right">
              <IconButton ><Arrow onClick={(e)=>this.handleClick(e, upload)} /></IconButton>
             </span></p>
            {upload.attachments.map((attachment)=>
              <p style={{padding:5}}>{attachment.name} <a target='_blank' href={attachment.downloadURL}><span style={{fontSize:12, color:blue300}}>View</span></a></p>
            )}
            <i>{timestamp.timeSince(upload.createdAt)}</i>
          </div>

       </Paper>)}
       <Popover
          open={this.state.openComment}
          anchorEl={this.state.anchorComment}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu>
            <MenuItem primaryText="Delete" onClick={()=>this.deletePost()} />
          </Menu>
        </Popover>
     </div>)
  }
  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ]
    return (
      <div className='row'>
        <div style={{marginTop:80}}></div>
        {(()=>{
          if (this.state.loading){
            return this.spinner()
          }else if (this.state.noUploads) {
            return this.noActivity()
          }else return this.showPageContent()
        })()}
        <Dialog
          title="Upload Questions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          >
            {this.state.uploadingImages ? <div className='text-center'><CircularProgress size={60} thickness={5} /> </div>:
            <div>
            <TextField
              hintText="Which university?"
              name='university'
              fullWidth
              floatingLabelText="University"
              value={this.state.university}
              className='text-center'
              onChange = {this.handleTextChange}
            />
            <TextField
              hintText="What course?"
              name='course'
              fullWidth
              value={this.state.course}
              floatingLabelText="Course"
              className='text-center'
              onChange = {this.handleTextChange}
            />
            {this.state.startUpload ?
              <div>
                {this.state.uploadedImages.map((image, index)=>
                  <p key={index}>{image.name} <span style={{fontSize:10, color:'red', cursor:'pointer'}} onClick={()=>this.removeImage(index)}>Remove</span></p>
                )}
               <RaisedButton onClick={()=>this.uploadQuestions()} label="Upload" secondary={true} buttonStyle={{backgroundColor:blue300}} />
              </div>
               :
              <FileReaderInput as="url" multiple id="my-file-input" onChange={this.handleFileInput}>
              <RaisedButton label="Select Files" secondary={true} buttonStyle={{backgroundColor:blue300}} />
            </FileReaderInput>}
            </div>
          }
          </Dialog>
      </div>
    )
  }
}
