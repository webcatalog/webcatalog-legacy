/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
  requestOpenInBrowser,
} from '../../../senders';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

import connectComponent from '../../../helpers/connect-component';

import firebase from '../../../firebase';

const styles = (theme) => ({
  listItemIcon: {
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      minWidth: 0,
    },
  },
  listItemText: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  profilePrimaryText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  profileSecondaryText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

const SectionAccount = ({
  classes,
  displayName,
  isSignedIn,
  photoURL,
  registered,
  onOpenDialogLicenseRegistration,
}) => (
  <>
    {!isSignedIn ? (
      <>
        <ListItem button onClick={() => requestOpenInBrowser('https://accounts.webcatalog.app/token')}>
          <ListItemIcon classes={{ root: classes.listItemIcon }}>
            <AccountCircleIcon fontSize="default" />
          </ListItemIcon>
          <ListItemText
            primary="Sign In"
          />
        </ListItem>
      </>
    ) : (
      <>
        <ListItem
          button
          alignItems="flex-start"
          onClick={() => {
            const template = [
              {
                label: 'Upgrade to WebCatalog Lifetime',
                click: () => onOpenDialogLicenseRegistration(),
                visible: !registered,
              },
              {
                type: 'separator',
                visible: !registered,
              },
              {
                label: 'Profile and Password',
                click: () => requestOpenInBrowser('https://accounts.webcatalog.app/settings/profile'),
              },
              {
                type: 'separator',
              },
              {
                label: 'Log Out',
                click: () => firebase.auth().signOut(),
              },
            ];

            const menu = window.remote.Menu.buildFromTemplate(template);
            menu.popup(window.remote.getCurrentWindow());
          }}
          title={`${displayName} (${registered ? 'WebCatalog Lifetime' : 'WebCatalog Basic'})`}
        >
          <ListItemAvatar className={classes.listItemIcon}>
            <Avatar alt={displayName} src={photoURL} />
          </ListItemAvatar>
          <ListItemText
            primary={displayName}
            secondary={registered ? 'WebCatalog Lifetime' : 'WebCatalog Basic'}
            classes={{
              root: classes.listItemText,
              primary: classes.profilePrimaryText,
              secondary: classes.profileSecondaryText,
            }}
          />
        </ListItem>
      </>
    )}
  </>
);

SectionAccount.defaultProps = {
  displayName: '',
  isSignedIn: false,
  photoURL: null,
  registered: false,
};

SectionAccount.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  isSignedIn: PropTypes.bool,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
  photoURL: PropTypes.string,
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  displayName: state.user.displayName,
  isSignedIn: state.user.isSignedIn,
  photoURL: state.user.photoURL,
  registered: state.preferences.registered,
});

const actionCreators = {
  openDialogLicenseRegistration,
};

export default connectComponent(
  SectionAccount,
  mapStateToProps,
  actionCreators,
  styles,
);
