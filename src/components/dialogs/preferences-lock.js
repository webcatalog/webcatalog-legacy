import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
  checkCurrentPassword,
} from '../../state/dialogs/preferences-lock/actions';

import {
  STRING_CANCEL,
  STRING_ENTER_CURRENT_PASSWORD,
  STRING_PASSWORD,
  STRING_CONTINUE,
  STRING_PREFERENCES,
} from '../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const PreferencesLock = (props) => {
  const {
    classes,
    currentPassword,
    currentPasswordErr,
    open,
    onClose,
    onFormUpdate,
    onCheckCurrentPassword,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_PREFERENCES}
      </DialogTitle>
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
    </Dialog>
  );
};

PreferencesLock.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onCheckCurrentPassword: PropTypes.func.isRequired,
  currentPassword: PropTypes.string,
  currentPasswordErr: PropTypes.string,
  open: PropTypes.bool,
};

PreferencesLock.defaultProps = {
  currentPassword: '',
  currentPasswordErr: null,
  open: false,
};

const mapStateToProps = state => ({
  currentPassword: state.dialogs.preferencesLock.form.currentPassword,
  currentPasswordErr: state.dialogs.preferencesLock.form.currentPasswordErr,
  open: state.dialogs.preferencesLock.open,
});

const actionCreators = {
  close,
  formUpdate,
  checkCurrentPassword,
};

export default connectComponent(
  PreferencesLock,
  mapStateToProps,
  actionCreators,
  styles,
);
