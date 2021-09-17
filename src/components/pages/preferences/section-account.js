/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import { getAuth } from 'firebase/auth';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  requestOpenInBrowser,
  requestSignInWithPopup,
} from '../../../senders';

import connectComponent from '../../../helpers/connect-component';

import '../../../firebase';

const SectionSync = ({
  currentPlan,
  displayName,
  isSignedIn,
  photoURL,
  registered,
}) => (
  <List disablePadding dense>
    {!isSignedIn ? (
      <>
        <ListItem
          button
          onClick={() => {
            // we don't use logging in with protocol webcatalog://
            // as it causes wrong Electron instance to be opened
            // e.g. it opens production app instead of dev env
            if (window.process.platform === 'linux' || process.env.NODE_ENV !== 'production') {
              requestSignInWithPopup();
              return;
            }
            requestOpenInBrowser('https://webcatalog.io/account/token/');
          }}
        >
          <ListItemText primary="Sign in to WebCatalog" />
          <ChevronRightIcon color="action" />
        </ListItem>
      </>
    ) : (
      <>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={displayName} src={photoURL} />
          </ListItemAvatar>
          <ListItemText
            primary={displayName}
            secondary={(() => {
              // if user is using lifetime plan, don't show any text to avoid confusion
              if (registered && currentPlan !== 'pro') return '-';
              return currentPlan === 'pro' ? 'WebCatalog Pro' : 'WebCatalog Basic';
            })()}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.io/account/settings/profile/')}>
          <ListItemText primary="Profile" />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.io/account/settings/password/')}>
          <ListItemText primary="Password" />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.io/account/settings/billing/')}>
          <ListItemText primary="Plans & Billing" />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => getAuth().signOut()}>
          <ListItemText primary="Sign Out" />
          <ChevronRightIcon color="action" />
        </ListItem>
      </>
    )}
  </List>
);

SectionSync.defaultProps = {
  currentPlan: 'basic',
  displayName: '',
  isSignedIn: false,
  photoURL: null,
  registered: false,
};

SectionSync.propTypes = {
  currentPlan: PropTypes.string,
  displayName: PropTypes.string,
  isSignedIn: PropTypes.bool,
  photoURL: PropTypes.string,
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentPlan: state.user.publicProfile.currentPlan,
  displayName: state.user.displayName,
  isSignedIn: state.user.isSignedIn,
  photoURL: state.user.photoURL,
  registered: state.preferences.registered,
});

export default connectComponent(
  SectionSync,
  mapStateToProps,
  null,
);
