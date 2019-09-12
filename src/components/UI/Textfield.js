import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
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
  }
}));

export default function Textfield({ onChange, type, error, autoComplete }) {
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
        error={error} // If the error string have some message the textfields turns red.
        margin='dense'
        className={classes.formControl}
        fullWidth
        variant="outlined"
      >
        <InputLabel required ref={labelRef} htmlFor="component-outlined">
          Email
        </InputLabel>
        <OutlinedInput
          autoComplete={autoComplete}
          fullWidth
          id="component-outlined"
          value={email}
          type={type}
          onChange={handleChange}
          labelWidth={labelWidth}
          autoFocus
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div >
  );
}