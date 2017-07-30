import React from 'react';

import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';

import TextField from 'material-ui/TextField';

import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';

import {
  formUpdate,
  save,
} from '../../../state/ui/dialogs/account/profile/actions';

const styleSheet = createStyleSheet('Profile', {
  textField: {
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
    onFormUpdate,
    onSave,
    isSaving,
  } = props;

  return (
    <div className={classes.root}>
      <div>
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="email"
          label="Email"
          marginForm
          onChange={e => onFormUpdate({ email: e.target.value })}
          placeholder="Enter your email"
          value={email}
        />
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="displayName"
          label="Display Name"
          marginForm
          onChange={e => onFormUpdate({ displayName: e.target.value })}
          placeholder="Enter a name you'd like to go by"
          value={displayName}
        />
      </div>
      <div className={classes.formFooter}>
        <Button
          disabled={isSaving}
          color="primary"
          onClick={onSave}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
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
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    displayName,
    email,
  } = state.ui.dialogs.account.profile.form;

  const { isSaving } = state.ui.dialogs.account.profile;

  return {
    displayName,
    email,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Profile));
