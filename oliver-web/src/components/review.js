import React, { Component } from 'react'
export default class Review extends Component {
  render() {
    return (
  <div>
    <section className="fun_facts parallax">
      <div className="section_overlay">
          <div className="container wow bounceInLeft" data-wow-duration="1s">
              <div className="row text-center">
                  <div className="col-md-3">
                      <div className="single_fun_facts">
                          <i className="pe-7s-cloud-download"></i>
                          <h2><span  className="counter_num">699</span> <span>+</span></h2>
                          <p>Downloads</p>
                      </div>
                  </div>
                  <div className="col-md-3">
                      <div className="single_fun_facts">
                          <i className="pe-7s-look"></i>
                          <h2><span  className="counter_num">1999</span> <span>+</span></h2>
                          <p>Likes</p>
                      </div>
                  </div>
                  <div className="col-md-3">
                      <div className="single_fun_facts">
                          <i className="pe-7s-comment"></i>
                          <h2><span  className="counter_num">199</span> <span>+</span></h2>
                          <p>Feedbacks</p>
                      </div>
                  </div>
                  <div className="col-md-3">
                      <div className="single_fun_facts">
                          <i className="pe-7s-cup"></i>
                          <h2><span  className="counter_num">10</span> <span>+</span></h2>
                          <p>Awards</p>
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
