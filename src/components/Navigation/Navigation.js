import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { listFlowers } from '../../state/flowerList/actions'

import style from './Navigation.module.css'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FlowerItem from './FlowerItem'
import Navbar from '../Navigation/Navbar'
import SidebarLeft from '../Navigation/SidebarLeft'
import Searchbar from './Searchbar'

function TabPanel (props) {
  const { children, value, index } = props

  return (
    <div style={{ visibility: value === index ? 'visible' : 'hidden' }}>
      {children}
    </div>
  )
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

class Navigation extends React.Component {
  state = {
    value: 0
  };

  componentDidMount () {
    const { loading, finished } = this.props.flowerList
    if (!loading && !finished) {
      this.props.listFlowers()
    }
  }

  render () {
    const {
      flowerList,
      children,
      sideBarOpen,
      toggleSideBar,
      globals
    } = this.props
    const { value } = this.state
    return [
      <SidebarLeft
        key='sidebarLeft'
        sideBarOpen={sideBarOpen}
        toggleSideBar={toggleSideBar}
      >
        <Searchbar />
        <AppBar
          position='static'
          color='primary'
          style={{ width: '320px', boxShadow: 'none' }}
        >
          <Tabs
            value={value}
            onChange={(event, newValue) => {
              this.setState({ value: newValue })
            }}
            indicatorColor='secondary'
            textColor='secondary'
            variant='scrollable'
            aria-label='flower tabs'
            className = {style.tabIndicator}
          >
            <Tab label='All' {...a11yProps(0)} />
            <Tab label='My Flowers' {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {flowerList.finished &&
            !flowerList.error &&
            flowerList.list.map(flower => {
              return (
                <Link
                  className={style.linkContainer}
                  to={`/flower/${flower.node.id}`}
                  key={flower.node.id}
                >
                  <FlowerItem
                    title={flower.title}
                    videoId={flower.node.video.url}
                    description={flower.description || undefined}
                    created={new Date(flower.created)}
                    user={flower.user}
                    id={flower.id}
                    isSelected={
                      flower.node.id.toString() === globals.selectedFlower
                    }
                  />
                </Link>
              )
            })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </SidebarLeft>,
      <Navbar key='navbar' />,
      <div key='children'>
        { children }
      </div>
    ]
  }
}

function mapStateToProps (state) {
  const { flowerList, settings, dispatch, globals } = state
  return { flowerList, settings, dispatch, globals }
}

const mapDispatchToProps = {
  listFlowers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)
