import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import connectComponent from '../../helpers/connect-component';

import {
  checkPassword,
  formUpdate,
} from '../../state/root/locker/actions';

import {
  STRING_ENTER_CURRENT_PASSWORD,
  STRING_PASSWORD,
  STRING_CONTINUE,
} from '../../constants/strings';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: grey[300],
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  inner: {
    textAlign: 'center',
  },
  button: {
    marginLeft: theme.spacing.unit,
  },
});

const Locker = (props) => {
  const {
    classes,
    password,
    passwordErr,
    onFormUpdate,
    onCheckPassword,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <Typography variant="body1">
          {STRING_ENTER_CURRENT_PASSWORD}
        </Typography>
        <TextField
          type="password"
          error={Boolean(passwordErr)}
          label={STRING_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ password: e.target.value })}
          value={password}
          helperText={passwordErr}
        />
        <Button onClick={onCheckPassword} color="primary" variant="contained" className={classes.button}>
          {STRING_CONTINUE}
        </Button>
      </div>
    </div>
  );
};

Locker.defaultProps = {
  password: '',
  passwordErr: null,
};

Locker.propTypes = {
  classes: PropTypes.object.isRequired,
  password: PropTypes.string,
  passwordErr: PropTypes.string,
  onCheckPassword: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  password: state.locker.form.password,
  passwordErr: state.locker.form.passwordErr,
});

const actionCreators = {
  checkPassword,
  formUpdate,
};

export default connectComponent(
  Locker,
  mapStateToProps,
  actionCreators,
  styles,
);
