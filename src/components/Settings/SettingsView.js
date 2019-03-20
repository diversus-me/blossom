import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeMethod, METHODS } from '../../actions/settings'

import styler from './Settings.module.css'

class SettingsView extends React.Component {
    constructor(props) {
        super(props)
        this.switchRendering = this.switchRendering.bind(this)
    }

    switchRendering(method) {
        const { dispatch, toggle } = this.props
        dispatch(changeMethod(method))
        toggle()
    }
    
    render() {
        const { settings } = this.props
        return(
            <div
                className={styler.container}
            >
                    <h3>Rendering Method</h3>
                    {METHODS.map((method) => 
                        <div
                            className={styler.option}
                            key={method}
                            onClick={() => this.switchRendering(method)}
                        >
                            <p className={(settings.selected === method) ? styler.active : ''}>
                            {method}
                            </p>
                        </div>
                    )}
            </div>
        )
    }
}

SettingsView.propTypes = {
    toggle: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    const { settings, dispatch } = state
    return { settings, dispatch }
  }

export default connect(mapStateToProps)(SettingsView)