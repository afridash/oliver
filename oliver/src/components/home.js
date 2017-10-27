import React, { Component } from 'react'
export default class Home extends Component {
  render() {
    return (
  <div><section className="header parallax home-parallax page" id="HOME">
    <h2></h2>
    <div className="section_overlay">
        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">
                        <img src="images/logo.png" alt="Logo" />
                    </a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="#HOME">HOME</a> </li>
                        <li><a href="#ABOUT">ABOUT </a> </li>
                        <li><a href="#FEATURES">FEATURES</a></li>
                        <li><a href="#SCREENS">SCREENS</a> </li>
                        <li><a href="#DOWNLOAD">DOWNLOAD </a> </li>
                        <li><a href="#SUSCRIBE">CONTACT </a> </li>
                        <li><a href="Login">LOGIN </a> </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div className="container home-container">
            <div className="row">
                <div className="col-md-8 col-sm-8">
                    <div className="home_text">
                        <h1>Oliver</h1>
                        <p>Exam Prep Simplified</p>

                        <div className="download-btn">
                            <a className="btn home-btn wow fadeInLeft" href="#DOWNLOAD">Download</a>
                            <a className="tuor btn wow fadeInRight" href="#ABOUT">Take a tour <i className="fa fa-angle-down"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-md-offset-1 col-sm-4">
                    <div className="home-iphone">
                        <img src="images/iPhone_Home.png" alt="" width={'120%'} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</section></div>
);
}
}
