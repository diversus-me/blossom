import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    width: '100%',
    textAlign: 'center',
    padding: 'none'
  },
}));

export default function ShareTextfield({ onChange }) {
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const labelRef = React.useRef(null);
  const classes = useStyles();

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  function handleChange(event) {
    setEmail(event.target.value);
    onChange(event.target.value);
  }

  return (
    <div className={classes.container}>
      <FormControl
        // error={true}
        margin='dense'
        className={classes.formControl}
        fullWidth
        variant="outlined"
      >
        <InputLabel required ref={labelRef} htmlFor="component-outlined">
          Email
        </InputLabel>
        <OutlinedInput
          autoComplete='email'
          fullWidth
          id="component-outlined"
          value={email}
          type="email"
          onChange={handleChange}
          labelWidth={labelWidth}
        />
        {/* <FormHelperText>Hello World</FormHelperText> */}
      </FormControl>
    </div >
  );
}