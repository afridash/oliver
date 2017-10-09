import React, { Component } from 'react'
export default class About extends Component {
  render() {
    return (
      <div>
      <section className="about page" id="ABOUT">
          <div className="container">
              <div className="row">
                  <div className="col-md-10 col-md-offset-1">
                      <div className="section_title">
                          <h2>About Us</h2>
                          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                      </div>
                  </div>

              </div>
          </div>
          <div className="inner_about_area">
              <div className="container">
                  <div className="row">
                      <div className="col-md-6">
                          <div className="about_phone wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".5s">
                              <img src="images/about_iphone.png" alt="" width={'70%'}/>
                          </div>
                      </div>
                      <div className="col-md-6  wow fadeInRight" data-wow-duration="1s" data-wow-delay=".5s">
                          <div className="inner_about_title">
                              <h2>Why we are best <br/> for you</h2>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                          </div>
                          <div className="inner_about_desc">
                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="1s">

                                  <div><i className="pe-7s-timer"></i></div>

                                  <h3>Lorem ipsum dolor sit amet</h3>
                                  <p>Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit.</p>
                              </div>




                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="1.5s">
                                  <div><i className="pe-7s-target"></i></div>
                                  <h3>Lorem ipsum dolor sit amet</h3>
                                  <p>Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit.</p>
                              </div>




                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="2s">

                                  <div><i className="pe-7s-stopwatch"></i></div>
                                  <h3>Lorem ipsum dolor sit amet</h3>
                                  <p>Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit.</p>
                              </div>


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
