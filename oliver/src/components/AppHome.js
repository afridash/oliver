import React, {Component} from 'react'
import SvgIcon from 'material-ui/SvgIcon'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {Redirect, Link} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'
import { ToastContainer, toast } from 'react-toastify'
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';
const firebase = require('firebase')
const styles = {
  radioButton: {
    marginTop: 16,
  },
};

const style = {
  chip: {
    margin: 4,
    backgroundColor:'#cfecf7',
  },
  paper:{
    textAlign: 'center',
    margin: 20,

  },
  height:50,
  textAlign: 'center',
};
const iconStyles = {
  marginRight: 24,
};


 class AppHome extends Component {
   constructor(props) {
     super(props);
     this.state = {
       open: false,
       logged: true,
       selectedIndex: 0,
       name:'',
       code:'',
       data:[],
       isLoading: true,
       noCourses:false,
       status:'',
       isloading:true,
       noActivity:false
     };
     this.toastId = null
     firebase.auth().onAuthStateChanged(this.handleUser.bind(this))
     this.ref = firebase.database().ref().child('user_courses')
     this.registeredRef = firebase.database().ref().child('registered_courses')
     this.badgesRef = firebase.database().ref().child('badges')
   }
   handleUser(user){
       if(user){
         this.setState({
          displayName:user.displayName,
          userPhoto:user.photoURL,
          userId:user.uid,
         })
         this.readAddCourses()
       }else{
         this.setState({redirect:true})
       }
     }
   handleClick (event, course) {
    // This prevents ghost click.
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      courseId:course.key,
    })
    }
   handleRequestClose = () => {
    this.setState({
      open: false,
    })
   }
   async readAddCourses() {
      /* 1. Set courses to empty before reloading online data to avoid duplicate entries
        2. Retrieve users courses from firebase and store them locally using AsyncStorage */
    this.data = []
    await this.ref.child(this.state.userId).once('value', (snapshot)=>{
      if (!snapshot.exists()) {
        this.setState({isLoading:false, noCourses:true})
      }
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, name:course.val().name, code:course.val().code, highest:course.val().highest})
        this.setState({data:this.data, refreshing:false, noCourses:false, isLoading:false})
      })
    })
    }
   select = (index) => this.setState({selectedIndex: index});
   handleDelete () {
     this.notify()
     this.ref.child(this.state.userId).child(this.state.courseId).remove().then(()=>{
       this.registeredRef.child(this.state.courseId).child(this.state.userId).remove().then(()=> {
         this.hideCourse(this.state.courseId)
         this.handleRequestClose()
       })
     })

   }
   notify = () => this.toastId = toast.warn("Deleting course", { autoClose: false });
   update = () => toast.update(this.toastId, {render:"Course has been deleted!", type: toast.TYPE.INFO, autoClose: 2000 });
   hideCourse(courseId) {
     this.data = this.state.data.filter((course)=> course.key !== courseId)
     if (this.data.length > 0) this.setState({data:this.data})
     else this.setState({noCourses:true})
     this.update()
   }
  showPageContent () {
     return (
       <div className="row">
         <div style={{marginTop:80}}></div>
         <ToastContainer />
         {this.state.data.map((course)=>
           <div className="col-lg-4" >
             <Paper style={style.paper} zDepth={2} rounded={true}
               children={<div>
                 <div className="row">
                   <div className='col-sm-4'>
                     <div className="panel panel-info" style={{borderRightWidth:2, borderTopWidth:0, borderLeftWidth:0, borderBottomWidth:0, borderColor:'none', margin:0}}>
                       <div className="panel-heading" style={{background:blue300,color:'white'}}> {course.code} </div>
                       <div className="panel-body">
                         <h3 style={{fontSize:15}}>HIGH SCORE</h3>
                         {course.highest ? <h3 style={{fontSize:15}}> {course.highest}% </h3> : <h3 style={{fontSize:15}}> Not Started </h3>}
                       </div>
                     </div>
                   </div>
                   <div className="col-sm-8">
                     <div>
                       <Paper style={style} zDepth={2}
                         children={<div>
                         <p>{course.name} <span onClick={(e)=>this.handleClick(e, course)} style={{fontSize:16, padding:5}} className='pull-right fa fa-angle-down fa-4x'></span></p>
                       </div>}/>
                     </div>
                       <div className="row">
                         <div className="col-sm-10 col-sm-offset-1">
                           <Link to={"/theories/"+course.key}>
                             <RaisedButton label="Theory" fullWidth={true} style={style.chip} />
                           </Link>
                           <Link to={"/objective/"+course.key}>
                             <RaisedButton label="Objective" fullWidth={true} style={style.chip} />
                           </Link>

                           <Link to={"/practice/"+course.key}>
                             <RaisedButton label="Exam" fullWidth={true} style={style.chip}/>
                           </Link>
                           <Popover
                              open={this.state.open}
                              anchorEl={this.state.anchorEl}
                              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                              targetOrigin={{horizontal: 'left', vertical: 'top'}}
                              onRequestClose={this.handleRequestClose}
                              animation={PopoverAnimationVertical}
                            >
                              <Menu>
                                <MenuItem primaryText="Delete" onClick={()=>this.handleDelete()} />
                              </Menu>
                            </Popover>
                         </div>
                       </div>
                   </div>
                 </div>
               </div> }/>
           </div>
         )}
         </div>
     )
   }
  loading () {
    const muiTheme = getMuiTheme({
       palette: {
         textColor: '#424242',
       },
       appBar: {
         height: 50,
         color:'#2d6ca1',
       },
     })
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div className='row text-center'>
        <div style={{marginTop:60}}></div>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <CircularProgress size={60} thickness={5} />
        </div>
        </div>
      </MuiThemeProvider>
    )
  }
  showNoCourses () {
    const muiTheme = getMuiTheme({
       palette: {
         textColor: '#424242',
       },
       appBar: {
         height: 50,
         color:'#2d6ca1',
       },
     })
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div className='row text-center'>
        <div style={{marginTop:60}}></div>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p className='text-info lead'>No Courses...</p>
          <Link to={"/courses"}>
            <RaisedButton label="Find Courses" primary={true} style={style.chip}/>
          </Link>
        </div>
        </div>
      </MuiThemeProvider>
    )
  }
  render() {
      if (this.state.isLoading) {
        return this.loading()
      }else if (this.state.noCourses) {
        return this.showNoCourses()
      }else {
        return this.showPageContent()
      }
  }
}

export default AppHome;
