import React, { Component } from 'react'
export default class Subscribe extends Component {
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row  wow lightSpeedIn">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="subscription-success"></div>
                        <div className="subscription-error"></div>
                        <form id="mc-form" action="https://designscrazed.us8.list-manage.com/subscribe/post" method="POST" className="subscribe_form">
                        <input type="hidden" name="u" value="6908378c60c82103f3d7e8f1c" />
                        <input type="hidden" name="id" value="8c5074025d" />
                            <div className="form-group">
                                <input type="email" autocapitalize="off" autocorrect="off" name="MERGE0" className="required email form-control" id="mce-EMAIL" placeholder="Enter Email Address" value="" />
                            </div>
                            <button type="submit" className="btn btn-default subs-btn">Submit</button>
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
