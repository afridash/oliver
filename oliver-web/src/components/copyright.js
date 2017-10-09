import React, { Component } from 'react'
export default class CopyRight extends Component {
  render() {
    return (
  <div>
    <section className="copyright">
        <h2></h2>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="copy_right_text">
                        <p>Copyright &copy; 2017. All Rights Reserved.</p>
                        <p>A theme by <a href="https://dcrazed.com/">Dcrazed</a></p>
                    </div>

                </div>

                <div className="col-md-6">
                    <div className="scroll_top">
                        <a href="#HOME"><i className="fa fa-angle-up"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
);
}
}
