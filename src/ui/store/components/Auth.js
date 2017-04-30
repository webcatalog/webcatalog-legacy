/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NonIdealState, Button, Intent, Classes } from '@blueprintjs/core';
import { remote } from 'electron';

import { signIn } from '../actions/auth';
import getServerUrl from '../helpers/getServerUrl';

const Auth = ({ onSignIn }) => (
  <div style={{ flex: 1, WebkitUserSelect: 'none', WebkitAppRegion: 'drag' }}>
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
          style={{ WebkitAppRegion: 'no-drag' }}
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
    let authWindow = new remote.BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      nodeIntegration: false,
      sandbox: true,
      session: remote.session.fromPartition('jwt'),
    });
    const authUrl = getServerUrl('/auth/google?jwt=1');
    authWindow.loadURL(authUrl);
    authWindow.show();

    // Handle the response
    authWindow.webContents.on('did-stop-loading', () => {
      if (/^.*(auth\/google\/callback\?code=).*$/.exec(authWindow.webContents.getURL())) {
        dispatch(signIn(authWindow.webContents.getTitle()));
        authWindow.destroy();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', () => {
      authWindow = null;
    }, false);
  },
});

export default connect(
  null, mapDispatchToProps,
)(Auth);
