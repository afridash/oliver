import React, {Component} from 'react'
import { Panel} from "react-bootstrap"

class RecentActivities extends Component {

handleClick (event) {
  alert('You Clicked My Ass!!');
}
  render(){
    return(
      <div className="center">
        <div className="row">
            <Panel onClick={(event) => this.handleClick(event)}>
              Some Basic Panel Shit!
            </Panel>
        </div>
      </div>
    );
  }
}

export default RecentActivities;
