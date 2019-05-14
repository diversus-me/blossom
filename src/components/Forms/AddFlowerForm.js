import React from 'react'
import { connect } from 'react-redux'

import style from './Forms.module.css'
import { addFlower } from '../../state/actions/flowerList'

class AddFlowerForm extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      titleValue: '',
      descriptionValue: '',
      youtubeLinkValue: ''
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { titleValue, descriptionValue, youtubeLinkValue } = this.state
    this.props.addFlower({ title: titleValue, description: descriptionValue, type: 'youtube', link: youtubeLinkValue })
  }

  handleChange (e, type) {
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
