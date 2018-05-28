import React, {Component} from 'react'
import Social from './social'
export default class SocialUser extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <Social userId={this.props.userId} backButton={true} />
    )
  }
}
