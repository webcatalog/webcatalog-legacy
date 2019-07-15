import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../../helpers/connect-component';

import {
  close,
  formUpdate,
  checkCurrentPassword,
} from '../../../state/dialogs/lock-app/actions';

import {
  STRING_CANCEL,
  STRING_ENTER_CURRENT_PASSWORD,
  STRING_PASSWORD,
  STRING_CONTINUE,
} from '../../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const EnterCurrentPassword = (props) => {
  const {
    classes,
    currentPassword,
    currentPasswordErr,
    onClose,
    onFormUpdate,
    onCheckCurrentPassword,
  } = props;

  return (
    <React.Fragment>
      <DialogContent className={classes.content}>
        <Typography variant="body1">
          {STRING_ENTER_CURRENT_PASSWORD}
        </Typography>
        <TextField
          error={Boolean(currentPasswordErr)}
          label={STRING_PASSWORD}
          fullWidth
          margin="normal"
          onChange={e => onFormUpdate({ currentPassword: e.target.value })}
          value={currentPassword}
          helperText={currentPasswordErr}
          type="password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={onCheckCurrentPassword}
        >
          {STRING_CONTINUE}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

EnterCurrentPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onCheckCurrentPassword: PropTypes.func.isRequired,
  currentPassword: PropTypes.string,
  currentPasswordErr: PropTypes.string,
};

EnterCurrentPassword.defaultProps = {
  currentPassword: '',
  currentPasswordErr: null,
};

const mapStateToProps = state => ({
  currentPassword: state.dialogs.lockApp.form.currentPassword,
  currentPasswordErr: state.dialogs.lockApp.form.currentPasswordErr,
});

const actionCreators = {
  close,
  formUpdate,
  checkCurrentPassword,
};

export default connectComponent(
  EnterCurrentPassword,
  mapStateToProps,
  actionCreators,
  styles,
);
