import React, { Component } from 'react'
export default class Screenshots extends Component {
  render() {
    return (
  <div>
    <section className="apps_screen page" id="SCREENS">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1 wow fadeInBig" data-wow-duration="1s">
                        <div className="section_title">
                            <h2>Screenshots</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                        </div>

                    </div>
                </div>
            </div>

        <div className="screen_slider">
            <div id="demo" className="wow bounceInRight" data-wow-duration="1s">
                <div id="owl-demo" className="owl-carousel">

                    <div className="item">
                    <a href="images/screens/iPhone04.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone04.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                    <div className="item">
                        <a href="images/screens/iPhone05.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone05.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                    <div className="item">
                        <a href="images/screens/iPhone06.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone06.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                    <div className="item">
                        <a href="images/screens/iPhone07.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone07.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                    <div className="item">
                        <a href="images/screens/iPhone08.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone08.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                    <div className="item">
                        <a href="images/screens/iPhone09.png" rel="prettyPhoto[pp_gal]"><img src="images/iPhone09.png" width="60" height="60" alt="APPS SCREEN" /></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
);
}
}
