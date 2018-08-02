import React, { Component } from 'react'
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar';
import NavBar from './navBar'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import {Firebase} from '../auth/firebase'
import University from './AddUniversity'
const firebase =  require('firebase')
export default class Home extends Component {
  constructor (props){
    super (props)
    this.state ={
      colleges:[],
      loading:true,
      displayName:'Anonymous',
      uni:''
    }
    this.colleges = []
    this.ref = firebase.database().ref().child('colleges')
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  async componentWillMount (){
    this.ref.once('value', (colleges)=>{
      if (!colleges.exists()) this.setState({loading:false})
      colleges.forEach((college)=>{
        this.colleges.unshift({
          name:college.val().college,
          departments:college.val().departments,
          faculties:college.val().faculties,
          questions:college.val().questions,
          createdBy:college.val().createdBy,
          key:college.key,
          published:college.val().published
        })
        this.setState({colleges:this.colleges, loading:false})
      })
    })

  }
  handleUser = (user) => {
    if (user) {
      this.setState({displayName:user.email})
    }
  }
  handleChange = (event) => {
    if (event.target.value === "Ascending") {
      this.setState({colleges:this.colleges.sort((a,b)=>a.questions-b.questions), sortOrder:event.target.value })
    }else if (event.target.value === "Descending") {
      this.setState({colleges:this.colleges.sort((a,b)=>b.questions-a.questions), sortOrder:event.target.value})
    }else {
      this.colleges.sort((a,b)=>{
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      this.setState({colleges:this.colleges, sortOrder:event.target.value})
    }
  }
  handleClick (event, item, index) {
    this.setState({
      open: true,
      anchorComment: event.currentTarget,
      currentKey:item.key,
      published:item.published,
      currentIndex:index,
      selectedUniversity:item.name
    })
  }
  handleClose = () => {
    this.setState({openDialog: false, editUniversity:false});
  };
  updateName = () => {
    if (this.state.selectedUniversity !== '' ){
      alert('Updating College')
      this.ref.child(this.state.currentKey).update({college:this.state.selectedUniversity})
      let item = this.state.colleges[this.state.currentIndex]
      item.name = this.state.selectedUniversity
      var clone = this.state.colleges
      clone[this.state.currentIndex] = item
      this.setState({colleges:clone, editUniversity:false})
    }
  }
  handleRequestClose = () => {
   this.setState({
     open: false,
     published:false
   })
  }
  handleRequestCloseSnack = () => {
    this.setState({
      openSnack: false,
    });
  };
  publish () {
    this.ref.child(this.state.currentKey).update({published:!this.state.published})
    let item = this.state.colleges[this.state.currentIndex]
    item.published = !this.state.published
    var clone = this.state.colleges
    clone[this.state.currentIndex] = item
    this.setState({colleges:clone, published:null, open:false, openSnack:true, message:"University was successfully edited"})
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
  showPageContent () {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    const options = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onClick={this.updateName}
      />
    ]
    return (
      <div className='col-sm-12'>
          <div style={{marginLeft:20}} className='pull-left'>
            <p>Sort Order</p>
            <select value={this.state.sortOrder} onChange={this.handleChange} className='form-control'>
              <option value=""></option>
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
              <option value="Alphabetically">Alphabetically</option>
            </select>
          </div>
          <div className='pull-right'>
            <RaisedButton label="Add New" secondary onClick={()=>this.setState({openDialog:true})}  />
          </div>
          <div className='col-sm-12'>
          {this.state.colleges.map((college, key)=>
            this.showCollege(college,key)
          )}
        </div>
        <Dialog
          title="Add University"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
        >
          <University user={this.state.displayName} />
        </Dialog>
        <Dialog
          title="Edit University"
          actions={options}
          modal={true}
          open={this.state.editUniversity}
        >
          <input className='form-control' value={this.state.selectedUniversity} onChange={(e)=>this.setState({selectedUniversity:e.target.value})}/>
        </Dialog>
      </div>
    )
  }
  showCollege (college, index) {
    return (
      <div className="col-sm-4">
        <div style={{margin:10}}>
          <Paper zDepth={2} rounded={true}>
            <Panel>
              <div className="card">
                <div className="card-header">
                  <span style={{marginTop:-20}} className="pull-right">
                    <IconButton tooltip="More..." >
                      <MoreVertIcon onClick={(e)=>this.handleClick(e, college, index)} />
                    </IconButton>
                  </span>
                </div>
                <br/>
                <Link to={'/in-house/college/'+college.key}>
                <div className="card card-body">
                  <div className="row">
                    <div className="col-sm-12" >
                      <p className='lead' > {college.name}</p>
                    </div>
                    <div className="col-sm-12">
                      <div className='col-sm-4'>
                        <span style={{color:'#580E0E'}}>Faculty: {college.faculties}</span>
                      </div>
                      <div className='col-sm-4'>
                        <span style={{color:'#580E0E'}}>Depts: {college.departments}</span>
                      </div>
                      <div className='col-sm-4'>
                        <span style={{color:'#580E0E'}}>Ques: {college.questions}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            </Panel>

          </Paper>
          <Popover
             open={this.state.open}
             anchorEl={this.state.anchorComment}
             anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
             targetOrigin={{horizontal: 'left', vertical: 'top'}}
             onRequestClose={this.handleRequestClose}
             animation={PopoverAnimationVertical}
           >
             <Menu>
               <MenuItem primaryText="Statistics" href={"/in-house/stats/"+this.state.currentKey} />
               {this.state.published ?  <MenuItem primaryText="Unpublish" onClick={()=>this.publish()}  /> : <MenuItem primaryText="Publish" onClick={()=>this.publish()}  /> }
               <MenuItem primaryText="Edit" onClick={()=>this.setState({editUniversity:true, open:false})}  />
             </Menu>
           </Popover>
        </div>
        <Snackbar
          open={this.state.openSnack}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestCloseSnack}
        />
      </div>
    )
  }
  pageContent () {
    return (
      <div className="col-sm-12">
          <div style={{marginTop:70}}></div>
          {
            (()=>{
              if (this.state.loading){
                return this.spinner()
              }
              else {
                return this.showPageContent()
              }
            })()
          }
      </div>
    )
  }
  render() {
    return (
      <NavBar children={this.pageContent()} />
    );
  }
}
