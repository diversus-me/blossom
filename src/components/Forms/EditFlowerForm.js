import React from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import style from './Forms.module.css'
import { listFlowers } from '../../state/actions/flowerList'

class EditFlowerForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      titleValue: props.title,
      descriptionValue: props.description
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { titleValue, descriptionValue } = this.state
    const { id } = this.props
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/flower`,
      {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, title: titleValue, description: descriptionValue })
      })
      .then(response => {
        if (response.ok) {
          return response
        } else {
          throw new Error('failed')
        }
      })
      .then(() => toast.success('Flower successfully updated'))
    // TODO: Why does reloading the flower instantly after deleting cause wrong responses?
      .then(setTimeout(this.props.listFlowers, 300))
      .catch(() => {
        toast.error('Flower could not be updated.')
      })
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
      default:
        break
    }
  }

  render () {
    const { titleValue, descriptionValue } = this.state
    return (
      <div className={style.container} onClick={e => e.preventDefault()}>
        <h1>Edit Flower</h1>
        <form className={style.form}>
          <input className={style.input} type='text' placeholder='Add a title' value={titleValue} onChange={e => { this.handleChange(e, 'title') }} />
          <input className={style.input} type='text' placeholder='Add a description' value={descriptionValue} onChange={e => { this.handleChange(e, 'desc') }} />
          <input className={style.submit} type='submit' value='Submit' onClick={this.handleSubmit} />
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
  listFlowers
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFlowerForm)
