import React from 'react'
import { connect } from 'react-redux'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import Webcam from '@uppy/webcam'
import AwsS3 from '@uppy/aws-s3'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

import style from './Forms.module.css'
import { addFlower } from '../../state/actions/flowerList'

const uppy = Uppy({
  meta: { type: 'avatar' },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true
})

uppy.use(Webcam)
uppy.use(AwsS3, {
  companionUrl: process.env.REACT_APP_SERVER_URL
})

class AddFlowerForm extends React.Component {
  state = {
    titleValue: '',
    descriptionValue: '',
    youtubeLinkValue: ''
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { titleValue, descriptionValue, youtubeLinkValue } = this.state
    this.props.addFlower({ title: titleValue, description: descriptionValue, type: 'youtube', link: youtubeLinkValue })
  }

  handleChange = (e, type) => {
    switch (type) {
      case 'title':
        this.setState({
          titleValue: e.target.value
        })
        break
      case 'desc':
        this.setState({
          descriptionValue: e.target.value
        })
        break
      case 'link':
        this.setState({
          youtubeLinkValue: e.target.value
        })
        break
      default:
        break
    }
  }

  render () {
    const { titleValue, descriptionValue, youtubeLinkValue } = this.state
    return (
      <div className={style.container}>
        <h1>Create new Flower</h1>
        <form onSubmit={this.handleSubmit} className={style.form}>
          <input className={style.input} type='text' placeholder='Add a title' value={titleValue} onChange={e => { this.handleChange(e, 'title') }} />
          <input className={style.input} type='text' placeholder='Add a description' value={descriptionValue} onChange={e => { this.handleChange(e, 'desc') }} />
          <input className={style.input} type='text' placeholder='Provide Youtube Link' value={youtubeLinkValue} onChange={e => { this.handleChange(e, 'link') }} />
          <input className={style.submit} type='submit' value='Submit' />
        </form>
        <Dashboard uppy={uppy} plugins={['Webcam']} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { flowers } = state
  return { flowers }
}

const mapDispatchToProps = {
  addFlower
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFlowerForm)
