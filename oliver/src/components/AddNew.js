import React, {Component} from 'react'
import {Tabs, Tab, Col, Panel, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {AddUniversity} from './AddUniversity'
import {AddFaculty} from './AddFaculty'
import {AddDepartment} from './AddDepartment'
import {Firebase} from '../auth/firebase'
const firebase =  require('firebase')
export class AddNew extends Component {
  render () {
    return (
      <Col xs={12} md={6} mdOffset={3} style={{marginTop:'5%'}}>
        <Panel header="Add New Information" bsStyle="primary" >
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="University">
              <AddUniversity />
            </Tab>
            <Tab eventKey={2} title="Faculty">
              <AddFaculty />
            </Tab>
            <Tab eventKey={3} title="Department">
              <AddDepartment />
            </Tab>
          </Tabs>
        </Panel>
        <div className='text-center'>
          <Link to="/"><Button bsStyle='danger' bsSize='small'>Go Home</Button></Link>
          </div>
      </Col>
    )
  }
}
