import React, {Component} from 'react'
import {Col, Table, Button} from 'react-bootstrap'
import {Questions} from './ViewQuestions'
import CircularProgress from 'material-ui/CircularProgress'
import NavBar from './navBar'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export default class AdminPay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users:[],
      loading:true
    }
    this.usersRef = firebase.database().ref().child('users')
    this.users = []
  }
  componentWillMount () {
    this.usersRef.once('value', (users)=>{
      users.forEach((user)=>{
        this.users.push({key:user.key, displayName:user.val().displayName, has_paid:user.val().has_paid, paid_on:user.val().paid_on, picture:user.val().profilePicture, payment_type:user.val().payment_type})
        this.setState({users:this.users, loading:false})
      })
    })
  }
  togglePay (user, key) {
    this.usersRef.child(user.key).update({
      has_paid:true,
      paid_on:firebase.database.ServerValue.TIMESTAMP,
      payment_type:'manual',
    })
    let item = this.state.users[key]
    item.has_paid = true
    item.paid_on = Date.now()
    item.payment_type = 'manual'
    var clone = this.state.users
    clone[key] = item
    this.setState({users:clone})
  }
  showPageContent () {
    return(
      <Col sm={12} xs={12} style={{marginTop:'5%'}}>
        <h3 className='text-center text-info'>All Users</h3>
        <div className='col-sm-12'>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Paid</th>
                <th>Paid On</th>
                <th>Payment Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((user, key)=>
                <tr key={key}>
                  <td>{key+1}</td>
                  <td>{user.displayName}</td>
                  <td>{user.has_paid ? "Yes" : "No" }</td>
                  <td>{user.has_paid ? moment(user.paid_on).format('LL') : ""}</td>
                  <td>{user.payment_type}</td>
                  <td>{!user.has_paid && <Button bsStyle='primary' onClick={()=>this.togglePay(user,key)} >Toggle Pay</Button>}</td>
                </tr>
              )}
            </tbody>
          </Table>

      </div>
      </Col>
    )
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
  render () {
    return (
      <NavBar children={this.pageContent()} />
    )
  }
}
