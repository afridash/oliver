import React, {Component} from 'react'
import PropTypes from 'prop-types'
import * as timestamp from '../auth/timestamp'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

class Comments extends Component {
  constructor (props) {
    super (props)
    this.state = {
      comments: [],
      tagged: [],
      index: 0,
      userId:'',
      followers: [],
      username:'',
      user:'',
      name:'Richard Igbiriki',
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }
  render () {
    const { classes } = this.props;
    return (
        <div className="col-sm-8 col-sm-offset-2">
          <br/>
          <div style={{marginTop:60}}></div>
            <Paper zDepth={3}>
              <Panel>
                <div className="card">
                  <div className="card-header">
                  </div>
                  <br/>
                  <div className="card card-body">
                    <div className="row">
                      <div className="col-sm-10 col-sm-offset-1">
                          <div>
                            {this.props.user ?
                              <div>
                                <Avatar
                                  src={this.props.item['profilePicture']}
                                  size={60}
                                /><span className='lead'> @{this.props.item['code']}<h4></h4></span>
                              </div>
                            :
                            <h4>{this.props.item['code']}</h4>
                          }
                            {this.props.item['post']}
                          </div>
                          <br/>
                          <br/>
                          {!this.props.noCreatedAt && <span className="pull-right">{timestamp.timeSince(this.props.item['createdAt'])}</span>}
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="col-sm-8 col-sm-offset-2">
                      <div className="row">
                          <span className="pull-right"><i className="fa fa-comment-o fa-lg" style={{cursor:'pointer'}}></i></span>
                          <span><i className="fa fa-bookmark-o fa-lg" style={{cursor:'pointer'}}></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Paper>
        </div>
      )
    }
  }
const tooltip = (
  <Tooltip id="tooltip">Delete</Tooltip>
);
export default Comments
