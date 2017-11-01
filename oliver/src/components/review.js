import React, { Component } from 'react'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export default class Review extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:0,
      colleges:0,
      courses:0,
    }
    this.ref = firebase.database().ref().child('oliver_stats')
  }
  componentWillMount () {
    this.ref.once('value', (snapshot)=>{
      this.setState(snapshot.val())
    })
  }
  render() {
    return (
  <div>
    <section className="fun_facts parallax">
      <div className="section_overlay">
          <div className="container wow bounceInLeft" data-wow-duration="1s">
              <div className="row text-center">
                  <div className="col-md-4">
                      <div className="single_fun_facts">
                          <i className="pe-7s-cloud-download"></i>
                          <h2><span  className="counter_num">{this.state.questions}</span> <span>+</span></h2>
                          <p>Questions</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="single_fun_facts">
                          <i className="pe-7s-look"></i>
                          <h2><span  className="counter_num">{this.state.courses}</span> <span>+</span></h2>
                          <p>Courses</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="single_fun_facts">
                          <i className="pe-7s-comment"></i>
                          <h2><span  className="counter_num">{this.state.colleges}</span> <span>+</span></h2>
                          <p>Universties</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </section>
</div>
);
}
}
