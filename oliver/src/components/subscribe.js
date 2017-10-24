import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export default class Subscribe extends Component {
  constructor (props) {
    super (props)
    this.state = {
      email:'',
      message:''
    }
  }
  handleChange = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }
  submit =(event) => {
    event.preventDefault()
    firebase.database().ref().child('subscribers').push(this.state.email)
    this.setState({email:'', message:'Kudos! We will remember you when something great happens at Afridash!'})
  }
  render() {
    return (
  <div>
    <section className="subscribe parallax subscribe-parallax" data-stellar-background-ratio="0.6" data-stellar-vertical-offset="20">
        <div className="section_overlay wow lightSpeedIn">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">

                        <div className="section_title">
                            <h2>SUBSCRIBE US</h2>
                            <p>Keep track of what we are doing...We won't bug you with unnecessary emails.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row  wow lightSpeedIn">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="subscription-success">{this.state.message}</div>
                        <div className="subscription-error"></div>
                        <form onSubmit={this.submit} id="mc-form" className="subscribe_form">
                            <div className="form-group">
                                <input onChange={this.handleChange} type="email" autocapitalize="off" autocorrect="off" name="email" className="required email form-control" id="mce-EMAIL" placeholder="Enter Email Address" value={this.state.email} />
                            </div>
                            <button type="submit" className="btn btn-default subs-btn">Subscribe!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
);
}
}
