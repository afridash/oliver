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
                          <p>We at Afridash are happy to introduce Oliver -- your one stop shop for exam preparation on your campus. With your help, we have built the perfect app to keep track of your courses, and provide you with a smooth experience to practice past questions from those courses. We simulated a practice exam with the objectives, and provided you a way to study theory questions. </p>
                          <p>Found an interesting question? Add it to your bookmarks! Did great on a practice exam? Share to EXPLORE! We want to see you succeed in your examinations, and we want you to have fun doing it!</p>
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
                              <p>Oliver aims to bring you the best learning experience when it comes to studying past questions in preparation for your future exams. And we do so for many reasons...and in many little ways too! Here is why</p>
                          </div>
                          <div className="inner_about_desc">
                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="1s">

                                  <div><i className="pe-7s-timer"></i></div>

                                  <h3>Productivity</h3>
                                  <p>Productivity is a problem that we all face when it comes to the time we allocate to studying. Oliver aims to minimize that by putting the power to study on the go in your pockets, and hands :) </p>
                                  <p>Want one last look at that question you still don't understand? Oliver got you!</p>
                              </div>




                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="1.5s">
                                  <div><i className="pe-7s-target"></i></div>
                                  <h3>Impact</h3>
                                  <p>We at Afridsh aim to make a positive impact on society, just turns out, helping students gain better grades fall under that category. So like everything else, we hope Oliver can have a positive effect on your studying process, and consequently, your grades! </p>
                                  <p>Impact First, Innovation Always</p>
                              </div>




                              <div className="single_about_area fadeInUp wow" data-wow-duration=".5s" data-wow-delay="2s">

                                  <div><i className="pe-7s-stopwatch"></i></div>
                                  <h3>Efficiency</h3>
                                  <p>With our simulated test environment, we aim to prepare you for you actual examinations. Time management during exams has always been a problem for students all over the world...we hope with Oliver, you can learn to use your time more efficiently. </p>
                                  <p>We try to provide you with as many questions as possible so you won't be surprise on the day of your exams. We do aim to improve your effiency level after all.</p>
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
