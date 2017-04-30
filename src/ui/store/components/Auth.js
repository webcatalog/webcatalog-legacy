import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NonIdealState, Button, Intent, Classes } from '@blueprintjs/core';

import { signIn } from '../actions/auth';

const Auth = ({ onSignIn }) => (
  <div style={{ flex: 1 }}>
    <NonIdealState
      visual={<img src="images/logo.png" alt="WebCatalog" className="logo" />}
      title="Sign in to Continue"
      description="We do not sell or share your information with anyone else."
      action={(
        <Button
          iconName="log-in"
          intent={Intent.DANGER}
          className={Classes.LARGE}
          text="Sign in with Google"
          onClick={onSignIn}
        />
      )}
    />
  </div>
);

Auth.propTypes = {
  onSignIn: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onSignIn: () => {
    dispatch(signIn('test'));
  },
});

export default connect(
  null, mapDispatchToProps,
)(Auth);
