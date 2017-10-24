import React, { Component } from 'react'
export default class Features extends Component {
  render() {
    return (
  <div>
    <section id="FEATURES" className="features page">
        <div className="container">
            <div className="row">
                <div className="col-md-10 col-md-offset-1">

                    <div className="section_title wow fadeIn" data-wow-duration="1s">
                        <h2>Features</h2>
                        <p>To ensure you maximize the best out of this App, we created a UI so easy to understand from it relatable contents, icons to it's colors to ensure easy navigation across the entire App. Take a look at some other features.</p>
                    </div>

                </div>
            </div>
        </div>

        <div className="feature_inner">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 right_no_padding wow fadeInLeft" data-wow-duration="1s">


                        <div className="left_single_feature">

                            <div><span className="pe-7s-like"></span></div>

                            <h3>Offline Capabilities<span>/</span></h3>
                            <p>Saving you from having to be online to retrieve questions and courses was one of our major focus, and we did it! You can view courses, bookmarks, questions, and activities offline...once you have downloaded them the first time.
</p>
                        </div>

                        <div className="left_single_feature">

                            <div><span className="pe-7s-science"></span></div>

                            <h3>Activities<span>/</span></h3>
                            <p>We help you keep track of your activities in practice exams. Recent activities is our way of saying...great job!</p>
                        </div>


                        <div className="left_single_feature">
                            <div><span className="pe-7s-look"></span></div>

                            <h3>Explore<span>/</span></h3>
                            <p>You did great, you want others to be inspired, or challenged? Share to EXPLORE. Users across your campus will be able see your performance and be challenged to do the same. On EXPLORE, you can search for other users to see what they've shared, or search for a course to see all EXPLORERS from that course.
</p>
                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="feature_iphone">
                            <img className="wow bounceIn" data-wow-duration="1s" src="images/iPhone02.png" alt="" />
                        </div>
                    </div>
                    <div className="col-md-4 left_no_padding wow fadeInRight" data-wow-duration="1s">

                        <div className="right_single_feature">
                            <div><span className="pe-7s-monitor"></span></div>

                            <h3><span>/</span>Exams</h3>
                            <p>We have developed a practice exam environment that randomizes questions so you are never bored of practicing. The more questions we have, the more fun and random your experience will be. And we strive to add more questions everyday! </p>
                        </div>

                        <div className="right_single_feature">

                            <div><span className="pe-7s-phone"></span></div>

                            <h3><span>/</span>Theme</h3>
                            <p>Want a more customizable interface that fits your every mood? Dont worry we also have that covered. Guess what? you also get to change it as many times as you want for FREE!</p>
                        </div>

                        <div className="right_single_feature">

                            <div><span className="fa fa-bookmark-o"></span></div>

                            <h3><span>/</span>bookmarks</h3>
                            <p>Seen a question you want to remember later? Just Bookmark IT! and when on the rush with no internet you can also view those specially bookmarked questions OFFLINE too!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div className="call_to_action">
        <div className="container">
            <div className="row wow fadeInLeftBig" data-wow-duration="1s">
                <div className="col-md-9">
                    <p>Want to know more about the app or try some of the listed features, and find other EXPLORERS from your school? then download the App.</p>
                </div>
                <div className="col-md-3">
                    <a className="btn btn-primary btn-action" href="https://play.google.com/store/apps/details?id=com.afridash.oliver" target='_blank' role="button">Download Now</a>
                </div>
            </div>
        </div>
    </div>
  </div>
);
}
}
