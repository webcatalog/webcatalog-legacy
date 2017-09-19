import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import TextField from 'material-ui/TextField';

import connectComponent from '../../helpers/connect-component';

import {
  formUpdate,
  save,
} from '../../state/dialogs/account/profile/actions';

import {
  STRING_DISPLAY_NAME,
  STRING_DISPLAY_NAME_PLACEHOLDER,
  STRING_EMAIL,
  STRING_EMAIL_PLACEHOLDER,
  STRING_SAVE,
  STRING_SAVING,
} from '../../constants/strings';

const styles = {
  textField: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formFooter: {
    alignSelf: 'flex-end',
    transform: 'translate(16px, 16px)',
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
      <div>
        <FormControl className={classes.formControl} error={emailError}>
          <InputLabel htmlFor="email">{STRING_EMAIL}</InputLabel>
          <Input
            id="email"
            onChange={e => onFormUpdate({ email: e.target.value })}
            placeholder={STRING_EMAIL_PLACEHOLDER}
            value={email}
          />
          {emailError ? <FormHelperText>{emailError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="displayName"
          label={STRING_DISPLAY_NAME}
          marginForm
          onChange={e => onFormUpdate({ displayName: e.target.value })}
          placeholder={STRING_DISPLAY_NAME_PLACEHOLDER}
          value={displayName}
        />
      </div>
      <div className={classes.formFooter}>
        <Button
          color="primary"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? STRING_SAVING : STRING_SAVE}
        </Button>
      </div>
    </div>
  );
};

Profile.defaultProps = {
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
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
