import React from 'react';

import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';

import TextField from 'material-ui/TextField';

import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';

import {
  formUpdate,
  save,
} from '../../state/dialogs/account/profile/actions';

import {
  STRING_DISPLAY_NAME_PLACEHOLDER,
  STRING_DISPLAY_NAME,
  STRING_EMAIL_PLACEHOLDER,
  STRING_EMAIL,
  STRING_SAVE,
  STRING_SAVING,
} from '../../constants/strings';

const styleSheet = createStyleSheet('Profile', {
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
});

const Profile = (props) => {
  const {
    classes,
    displayName,
    email,
    emailError,
    onFormUpdate,
    onSave,
    isSaving,
  } = props;

  return (
    <div className={classes.root}>
      <div>
        <FormControl className={classes.formControl} error={emailError}>
          <InputLabel htmlFor="email">{STRING_EMAIL}</InputLabel>
          <Input
            id="email"
            placeholder={STRING_EMAIL_PLACEHOLDER}
            value={email}
            onChange={e => onFormUpdate({ email: e.target.value })}
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
          disabled={isSaving}
          color="primary"
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
  isSaving: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
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

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Profile));
