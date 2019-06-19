import React from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import style from './Forms.module.css'
import { getFlowerData } from '../../state/actions/flowerData'
import TimeField from 'react-simple-timefield'
import moment from 'moment'

function toString (time) {
  return moment.utc(time * 1000).format('HH:mm:ss')
}

class AddNodeForm extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      titleValue: props.title || '',
      sourceInValue: toString(props.sourceIn) || '00:00:00',
      sourceOutValue: toString(props.sourceOut) || '00:00:00',
      targetInValue: toString(props.targetIn) || '00:00:00',
      targetOutValue: toString(props.targetOut) || '00:00:00',
      flavorValue: props.flavor || 'neutral',
      nodeDuration: props.rootDuration
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { visibility } = this.props
    if (visibility !== nextProps.visibility) {
      this.setState({
        titleValue: nextProps.title,
        sourceInValue: toString(nextProps.sourceIn),
        sourceOutValue: toString(nextProps.sourceOut),
        targetInValue: toString(nextProps.targetIn),
        targetOutValue: toString(nextProps.targetOut),
        flavorValue: nextProps.flavor,
        nodeDuration: nextProps.rootDuration
      })
    }

    return true
  }

  handleSubmit (e) {
    e.preventDefault()
    const { id, flowerID } = this.props
    const { titleValue, sourceInValue, sourceOutValue, targetInValue, targetOutValue, flavorValue } = this.state

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/node`,
      {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          title: titleValue,
          sourceIn: moment(sourceInValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
          sourceOut: moment(sourceOutValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
          targetIn: moment(targetInValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
          targetOut: moment(targetOutValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
          flavor: flavorValue
        })
      })
      .then(response => {
        if (response.ok) {
          return response
        } else {
          throw new Error('failed')
        }
      })
      .then(() => toast.success('Node successfully updated'))
    // TODO: Why does reloading the flower instantly after deleting cause wrong responses?
      .then(setTimeout(() => { this.props.getFlowerData(flowerID) }, 300))
      .catch(() => {
        toast.error('Node could not be updated.')
      })
  }

  handleChange (e, type) {
    switch (type) {
      case 'title':
        this.setState({
          titleValue: e.target.value
        })
        break
      case 'sourceIn': {
        const { rootDuration } = this.props

        let newValue = e
        if (moment(e, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') > rootDuration) {
          newValue = moment.utc(rootDuration * 1000).format('HH:mm:ss')
        }

        let newOutValue = this.state.sourceOutValue
        if (moment(newOutValue, 'HH:mm:ss').isSameOrBefore(moment(e, 'HH:mm:ss'))) {
          newOutValue = newValue
        }

        this.setState({
          sourceInValue: newValue,
          sourceOutValue: newOutValue
        })
        break
      }
      case 'sourceOut': {
        const { rootDuration } = this.props

        let newValue = e
        if (moment(e, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') > rootDuration) {
          newValue = moment.utc(rootDuration * 1000).format('HH:mm:ss')
        }

        let newInValue = this.state.sourceInValue
        if (moment(newInValue, 'HH:mm:ss').isSameOrAfter(moment(e, 'HH:mm:ss'))) {
          newInValue = newValue
        }

        this.setState({
          sourceOutValue: newValue,
          sourceInValue: newInValue
        })
        break
      }
      case 'targetIn': {
        const { nodeDuration } = this.state

        let newValue = e
        if (moment(e, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') > nodeDuration) {
          newValue = moment.utc(nodeDuration * 1000).format('HH:mm:ss')
        }

        let newOutValue = this.state.targetOutValue
        if (moment(newOutValue, 'HH:mm:ss').isSameOrBefore(moment(e, 'HH:mm:ss'))) {
          newOutValue = newValue
        }

        this.setState({
          targetInValue: newValue,
          targetOutValue: newOutValue
        })
        break
      }
      case 'targetOut': {
        const { nodeDuration } = this.state

        let newValue = e
        if (moment(e, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') > nodeDuration) {
          newValue = moment.utc(nodeDuration * 1000).format('HH:mm:ss')
        }

        let newInValue = this.state.targetInValue
        if (moment(newInValue, 'HH:mm:ss').isSameOrAfter(moment(e, 'HH:mm:ss'))) {
          newInValue = newValue
        }

        this.setState({
          targetOutValue: newValue,
          targetInValue: newInValue
        })
        break
      }
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
    const { titleValue, sourceInValue, sourceOutValue, flavorValue, targetInValue, targetOutValue } = this.state
    return (
      <div className={style.container}>
        <h1>Edit Node</h1>
        <form onSubmit={this.handleSubmit} className={style.form}>
          <input className={style.input} type='text' placeholder='Add a title' value={titleValue} onChange={e => { this.handleChange(e, 'title') }} />
          {/* <input className={style.input} type='text' placeholder='Provide Youtube Link' value={youtubeLinkValue} onChange={e => { this.handleChange(e, 'link') }} /> */}
          <div>
            <span className={style.text}>SourceIn: </span>
            <TimeField
              value={sourceInValue}
              onChange={e => this.handleChange(e, 'sourceIn')}
              showSeconds
            />
          </div>
          <div>
            <span className={style.text}>SourceOut: </span>
            <TimeField
              value={sourceOutValue}
              onChange={e => this.handleChange(e, 'sourceOut')}
              showSeconds
            />
          </div>
          <div>
            <span className={style.text}>TargetIn: </span>
            <TimeField
              value={targetInValue}
              onChange={e => this.handleChange(e, 'targetIn')}
              showSeconds
            />
          </div>
          <div>
            <span className={style.text}>TargetOut: </span>
            <TimeField
              value={targetOutValue}
              onChange={e => this.handleChange(e, 'targetOut')}
              showSeconds
            />
          </div>
          {/* <input className={style.input} type='number' placeholder='sourceIn' value={sourceInValue} onChange={e => this.handleChange(e, 'sourceIn')} disabled={(!validLink)} /> */}
          {/* <input className={style.input} type='number' placeholder='sourceout' value={sourceOutValue} onChange={e => this.handleChange(e, 'sourceOut')} disabled={(!validLink)} /> */}
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
  getFlowerData
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNodeForm)
