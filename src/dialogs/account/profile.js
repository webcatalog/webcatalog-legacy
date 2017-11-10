import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {
  DialogActions,
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  formUpdate,
  save,
} from '../../actions/dialogs/account/profile/actions';

import {
  STRING_DISPLAY_NAME,
  STRING_DISPLAY_NAME_PLACEHOLDER,
  STRING_EMAIL,
  STRING_EMAIL_PLACEHOLDER,
  STRING_SAVE,
  STRING_SAVING,
} from '../../constants/strings';

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};

const Profile = (props) => {
  const {
    classes,
    displayName,
    email,
    emailError,
    isSaving,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <div className={classes.root}>
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          disabled={isSaving}
          id="email"
          label={emailError || STRING_EMAIL}
          margin="normal"
          onChange={e => onFormUpdate({ email: e.target.value })}
          placeholder={STRING_EMAIL_PLACEHOLDER}
          value={email}
          error={Boolean(emailError)}
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
    </div>
  );
};

Profile.defaultProps = {
  displayName: null,
  email: null,
  emailError: null,
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  email: PropTypes.string,
  emailError: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    displayName,
    email,
    emailError,
  } = state.dialogs.account.profile.form;

  const { isSaving } = state.dialogs.account.profile;

  return {
    displayName,
    email,
    emailError,
    isSaving,
  };
};

const actionCreators = {
  formUpdate,
  save,
};

export default connectComponent(
  Profile,
  mapStateToProps,
  actionCreators,
  styles,
);
