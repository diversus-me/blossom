import React from 'react'
import { connect } from 'react-redux'

import style from './Forms.module.css'
import { addNode } from '../../state/flowerData/actions'
import getVideoId from 'get-video-id'
import TimeField from 'react-simple-timefield'
import moment from 'moment'

class AddNodeForm extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      titleValue: '',
      youtubeLinkValue: '',
      sourceInValue: '00:00:00',
      sourceOutValue: '00:00:00',
      targetInValue: '00:00:00',
      targetOutValue: '00:00:00',
      flavorValue: 'neutral',
      validLink: false,
      nodeDuration: 0
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { visibility } = this.props
    if (visibility !== nextProps.visibility) {
      this.setState({
        sourceInValue: moment.utc(nextProps.currentTime * 1000).format('HH:mm:ss'),
        sourceOutValue: moment.utc(nextProps.currentTime * 1000).format('HH:mm:ss')
      })
    }

    const { nodeDuration } = this.state
    if (nodeDuration !== nextState.nodeDuration) {
      this.setState({
        targetOutValue: moment.utc(nextState.nodeDuration * 1000).format('HH:mm:ss')
      })
    }

    return true
  }

  handleSubmit (e) {
    e.preventDefault()
    const { id } = this.props
    const { titleValue, youtubeLinkValue, sourceInValue, sourceOutValue, targetInValue, targetOutValue, flavorValue } = this.state
    const { addNode } = this.props
    addNode(id, {
      id,
      title: titleValue,
      type: 'youtube',
      link: youtubeLinkValue,
      sourceIn: moment(sourceInValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
      sourceOut: moment(sourceOutValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
      targetIn: moment(targetInValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
      targetOut: moment(targetOutValue, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
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
        const { id } = getVideoId(e.target.value)
        if (id) {
          fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/videoLength/?videolink=${e.target.value}`,
            {
              credentials: 'include',
              method: 'GET'
            })
            .then((res) => {
              if (res.ok) {
                return res.json()
              } else {
                throw new Error()
              }
            })
            .then((json) => {
              if (json.duration) {
                this.setState({
                  validLink: true,
                  nodeDuration: json.duration
                })
              }
            })
            .catch(() => { this.setState({ validLink: false }) })
        }
        this.setState({
          youtubeLinkValue: e.target.value,
          validLink: false
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
    const { titleValue, youtubeLinkValue, sourceInValue, sourceOutValue, flavorValue, validLink, targetInValue, targetOutValue } = this.state
    return (
      <div className={style.container}>
        <h1>Create new Node</h1>
        <form onSubmit={this.handleSubmit} className={style.form}>
          <input className={style.input} type='text' placeholder='Add a title' value={titleValue} onChange={e => { this.handleChange(e, 'title') }} />
          <input className={style.input} type='text' placeholder='Provide Youtube Link' value={youtubeLinkValue} onChange={e => { this.handleChange(e, 'link') }} />
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
              disabled={!validLink}
            />
          </div>
          <div>
            <span className={style.text}>TargetOut: </span>
            <TimeField
              value={targetOutValue}
              onChange={e => this.handleChange(e, 'targetOut')}
              showSeconds
              disabled={!validLink}
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
          <input className={style.submit} type='submit' value='Submit' disabled={!validLink} />
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
