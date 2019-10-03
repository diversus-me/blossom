import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  typography: {
    'fontFamily': '"Nunito", "Helvetica", "Arial", sans-serif'
  },
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
  },
  breakpoints: {
    values: {
      sm: 700
    }
  }
})

export default theme
