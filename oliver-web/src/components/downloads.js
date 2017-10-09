import React, { Component } from 'react'
export default class Downloads extends Component {
  render() {
    return (
  <div>
    <section className="download page" id="DOWNLOAD">
        <div className="container">
        </div>



        <div className="available_store">
            <div className="container  wow bounceInRight" data-wow-duration="1s">
                <div className="col-md-6">
                    <div className="available_title">
                        <h2>Available on</h2>
                        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <a href="">
                            <div className="col-md-4 no_padding">
                                <div className="single_store">
                                    <i className="fa fa-apple"></i>
                                    <div className="store_inner">
                                        <h2>iOS</h2>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <div className="col-md-4 no_padding">
                            <a href="">
                                <div className="single_store">
                                    <i className="fa fa-android"></i>
                                    <div className="store_inner">
                                        <h2>ANDROID</h2>
                                    </div>
                                </div>
                            </a>
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
