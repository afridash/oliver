import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router-dom'
import Remove from 'material-ui/svg-icons/content/delete-sweep';
import CircularProgress from 'material-ui/CircularProgress';

const firebase = require('firebase')
/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
 const muiTheme = getMuiTheme({
   palette: {
     textColor: '#424242',
   },
   appBar: {
     height: 50,
     color:'#2d6ca1',
   },
 })
export default class Bookmarks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks:[],
      data:[],
      isloading:true,
      noActivity:false,
      next:false,
      current:0,
      counter:0,
    };
    firebase.auth().onAuthStateChanged(this.handleUser)
    this.bookmarksRef = firebase.database().ref().child('bookmarks')
    this.increment = 14
    this.data = []
  }
  handleUser = (user) => {
    if (user) {
        this.setState({username:user.displayName, userId:user.uid, photoURL:user.photoURL})
        this.getBookmarks (user.uid)
      }
    }
  async getBookmarks (userId) {
    //Get bookmarks from db using userId
    await this.bookmarksRef.child(userId).orderByChild('type').once('value', (bookmarks)=> {
      this.bookmarks = []
    //  console.log(bookmarks.val())
    //If bookmarks are not found
     if (!bookmarks.exists()) {
       this.setState({
       isloading:false,
       noActivity:true})
     }
      //Loop through each bookmark
      bookmarks.forEach((question)=>{
        var answer = ''
        if (question.val().answer.toLowerCase() === 'a') answer = question.val().optionA
        if (question.val().answer.toLowerCase() === 'b') answer = question.val().optionB
        if (question.val().answer.toLowerCase() === 'c') answer = question.val().optionC
        if (question.val().answer.toLowerCase() === 'd') answer = question.val().optionD

        this.bookmarks.unshift({key:question.key, answer:answer,question:
          question.val().question})
      })
    })
    await  this.bookmarks.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
    this.showNextSet()
  }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.bookmarks[i])
       this.setState({bookmarks:this.data, isloading:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
     if (this.state.counter + this.increment > this.bookmarks.length-1){
       await this.setState({current:this.state.counter, counter:this.bookmarks.length-1, next:false,})
     }else {
         await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
     }
     await this.getNextSet()
   }
  handleDelete (key) {
    //Delete entry with userId and key of entry
    this.bookmarksRef.child(this.state.userId).child(key).remove()
   //Filter activities and return items whose key is not equal to item deleted
   this.data = this.data.filter ((bookmark)=> bookmark.key !== key)
   //update state with remaining items
   this.setState({bookmarks:this.data})
   }
  spinner () {
     return (
       <div className='row text-center'>
         <div className='col-md-6 col-md-offset-3'>
           <br />  <br />
           <CircularProgress size={60} thickness={5} />
         </div>
       </div>
     )
    }
  noActivity () {
    return (
      <div className='row text-center'>
        <div className='col-sm-6 col-sm-offset-3'>
          <br />  <br />
          <p className='text-info lead'>No Bookmarks</p>
        </div>
        </div>
      )
    }
  showPageContent () {
   return(
     <div className="container">
       <div className="row">
         <div className="col-sm-8 col-sm-offset-2" >
           {this.state.bookmarks.map((bookmark)=>
           <Paper  zDepth={2}
             children={<div>
            <div className="panel panel-default">
              <div className="panel-heading">
             <p style={{ fontSize:20}}>{bookmark.question }
               <span className="pull-right">
                 <IconButton tooltip="Remove" onClick={()=> this.handleDelete(bookmark.key)}>
                   <Remove />
                 </IconButton>
               </span></p>
              </div>
              <div className="panel-body">
                <div style={{fontSize:20}} >
                  <div className='panel panel-default'  style={{paddingTop:10, margin:3, background:this.state.divColor}}>
                   <p style={{fontSize:20}}>Correct Answer: {bookmark.answer}</p></div>
                </div>

              </div>
            </div>
          </div>
        }/>
      )}
      <div className='col-sm-12 text-center'>
        {this.state.next && <RaisedButton className='text-center' label="Show More" primary={true} onClick={()=>{this.showNextSet()}}/>}
      </div>
         </div>
       </div>
     </div>
   )
  }
  render() {

    return (
        <MuiThemeProvider muiTheme={muiTheme} >
      <div className="center">
        <div classNmae="row">
          <br/>
          <div style={{marginTop:60}}></div>
          {
            (()=>{
            if (this.state.isloading){
              return this.spinner()
            }
            else if (this.state.noActivity) {
              return this.noActivity()
            }
            else {
              return this.showPageContent()
            }
          })()
        }
        </div>
      </div>
       </MuiThemeProvider>
    );
  }
}
