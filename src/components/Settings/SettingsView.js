import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changePositioning, POSITIONING } from '../../state/actions/settings'

import styler from './Settings.module.css'

class SettingsView extends React.Component {
    constructor(props) {
        super(props)
        this.switchRendering = this.switchRendering.bind(this)
    }

    switchRendering(positioning) {
        const { dispatch, toggle } = this.props
        dispatch(changePositioning(positioning))
        toggle()
    }
    
    render() {
        const { settings } = this.props
        return(
            <div
                className={styler.container}
            >
                    <h3>Rendering Method</h3>
                    {POSITIONING.map((positioning) => 
                        <div
                            className={styler.option}
                            key={positioning}
                            onClick={() => this.switchRendering(positioning)}
                        >
                            <p className={(settings.positioning === positioning) ? styler.active : ''}>
                            {positioning}
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