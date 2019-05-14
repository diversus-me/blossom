import React from 'react'
import { connect } from 'react-redux'

import style from './Forms.module.css'
import { addNode } from '../../state/actions/flowerData'

class AddNodeForm extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      titleValue: '',
      youtubeLinkValue: '',
      sourceInValue: '',
      sourceOutValue: '',
      flavorValue: 'neutral'
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { id } = this.props
    const { titleValue, youtubeLinkValue, sourceInValue, sourceOutValue, flavorValue } = this.state
    const { addNode } = this.props
    addNode(id, {
      id,
      title: titleValue,
      type: 'youtube',
      link: youtubeLinkValue,
      sourceIn: sourceInValue,
      sourceOut: sourceOutValue,
      targetIn: 0,
      targetOut: 0,
      sourceLength: 100,
      flavor: flavorValue
    })
  }

  handleChange (e, type) {
    switch (type) {
      case 'title':
        this.setState({
          titleValue: e.target.value
        })
        break
      case 'link':
        this.setState({
          youtubeLinkValue: e.target.value
        })
        break
      case 'sourceIn':
        this.setState({
          sourceInValue: e.target.value
        })
        break
      case 'sourceOut':
        this.setState({
          sourceOutValue: e.target.value
        })
        break
      case 'flavor':
        this.setState({
          flavorValue: e.target.value
        })
        break
      default:
        break
    }
  }

  render () {
    const { titleValue, youtubeLinkValue, sourceInValue, sourceOutValue, flavorValue } = this.state
    return (
      <div className={style.container}>
        <h1>Create new Node</h1>
        <form onSubmit={this.handleSubmit} className={style.form}>
          <input className={style.input} type='text' placeholder='Add a title' value={titleValue} onChange={e => { this.handleChange(e, 'title') }} />
          <input className={style.input} type='text' placeholder='Provide Youtube Link' value={youtubeLinkValue} onChange={e => { this.handleChange(e, 'link') }} />
          <input className={style.input} type='number' placeholder='sourceIn' value={sourceInValue} onChange={e => this.handleChange(e, 'sourceIn')} />
          <input className={style.input} type='number' placeholder='sourceout' value={sourceOutValue} onChange={e => this.handleChange(e, 'sourceOut')} />
          <select
            name='flavors'
            value={flavorValue}
            className={style.select}
            onChange={e => { this.handleChange(e, 'flavor') }}
          >
            <option value='neutral'>Neutral</option>
            <option value='pro'>Pro</option>
            <option value='contra'>Contra</option>
            <option value='science'>Science</option>
            <option value='joke'>Joke</option>
            <option value='factChecker'>Fact Check</option>
          </select>
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
  addNode
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNodeForm)
