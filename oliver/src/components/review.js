import React, { Component } from 'react'
export default class Review extends Component {
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
                          <h2><span  className="counter_num">2800</span> <span>+</span></h2>
                          <p>Questions</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="single_fun_facts">
                          <i className="pe-7s-look"></i>
                          <h2><span  className="counter_num">80</span> <span>+</span></h2>
                          <p>Courses</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="single_fun_facts">
                          <i className="pe-7s-comment"></i>
                          <h2><span  className="counter_num">3</span> <span>+</span></h2>
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
