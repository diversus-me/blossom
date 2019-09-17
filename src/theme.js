import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#333333',
      light: '#666666'
    },
    notification: {
      main: '#FC1A45'
    },
    error: {
      main: '#FC1A45'
    },
    background: {
      default: '#fff'
    }
  }
})

export default theme
