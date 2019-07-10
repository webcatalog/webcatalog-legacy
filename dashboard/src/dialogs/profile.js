import React from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Dialog, {
  DialogActions,
  DialogContent,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import connectComponent from '../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../state/dialogs/profile/actions';
import {
  STRING_PROFILE,
  STRING_DISPLAY_NAME,
  STRING_DISPLAY_NAME_PLACEHOLDER,
  STRING_EMAIL,
  STRING_EMAIL_PLACEHOLDER,
  STRING_SAVE,
  STRING_SAVING,
} from '../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = theme => ({
  linearProgress: {
    opacity: 0,
  },
  toolbar: {
    padding: '0 12px',
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.text.divider}`,
  },
  dialogContent: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    minWidth: 320,
    boxSizing: 'border-box',
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  textField: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
});

const DialogProfile = (props) => {
  const {
    classes,
    onClose,
    open,
    displayName,
    email,
    emailError,
    isSaving,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_PROFILE}
      </EnhancedDialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          disabled={isSaving}
          id="email"
          label={STRING_EMAIL}
          margin="normal"
          onChange={e => onFormUpdate({ email: e.target.value })}
          placeholder={STRING_EMAIL_PLACEHOLDER}
          value={email}
          error={emailError}
        />
        <TextField
          fullWidth
          disabled={isSaving}
          id="displayName"
          label={STRING_DISPLAY_NAME}
          margin="normal"
          onChange={e => onFormUpdate({ displayName: e.target.value })}
          placeholder={STRING_DISPLAY_NAME_PLACEHOLDER}
          value={displayName}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? STRING_SAVING : STRING_SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogProfile.defaultProps = {
  open: false,
};

DialogProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    open,
    form,
    isSaving,
  } = state.dialogs.profile;

  const {
    displayName,
    email,
    emailError,
  } = form;

  return {
    displayName,
    email,
    emailError,
    isSaving,
    open,
  };
};

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogProfile,
  mapStateToProps,
  actionCreators,
  styles,
);
