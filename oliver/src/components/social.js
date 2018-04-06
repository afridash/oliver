import React, {Component} from 'react'

export default class Social extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  spinner () {
    return (
      <div className='col-sm-10 col-sm-offset-1'>
        <p>
          No Spinner
        </p>
      </div>
    )
  }
  noActivity () {
    return  (
      <div className='col-sm-10 col-sm-offset-1'>
        <p>
          No Activity
        </p>
      </div>
    )
  }
  showPageContent () {
    return (
        <div className='col-sm-10 col-sm-offset-1'>
          <p>Hello Social</p>
        </div>
    )
  }
  render () {
    return (
      <div className='row'>
        <div style={{marginTop:100}}></div>
        {(()=>{
          if (this.state.loading)
          return this.spinner()
          else if (this.state.noActivity)
          return this.noActivity()
          else return this.showPageContent()
        })()}
      </div>
    )
  }
}
