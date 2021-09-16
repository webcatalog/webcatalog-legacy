/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import {
  requestOpenInBrowser,
} from '../../../senders';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

import connectComponent from '../../../helpers/connect-component';

import firebase from '../../../firebase';

const styles = (theme) => ({
  upgradeListItem: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  listItemIcon: {
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      minWidth: 0,
    },
  },
  listItemText: {
    userSelect: 'none',
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
  currentPlan,
  classes,
  displayName,
  isSignedIn,
  photoURL,
  registered,
  onOpenDialogLicenseRegistration,
}) => {
  const showTooltip = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (!isSignedIn) {
    const loginListItem = (
      <ListItem
        dense
        classes={{ container: classes.upgradeListItem }}
      >
        <ListItemText
          className={classes.listItemText}
          primary={registered ? 'Lifetime Plan' : 'Basic Plan'}
        />
        {!registered && (
          <ListItemSecondaryAction>
            <Button size="small" onClick={() => onOpenDialogLicenseRegistration()} color="inherit">
              Upgrade
            </Button>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );

    return loginListItem;
  }

  let displayedPlan = currentPlan;
  if (currentPlan === 'basic' && registered) {
    displayedPlan = 'pro';
  }

  const accountListItem = (
    <ListItem
      button
      alignItems="flex-start"
      onClick={() => {
        const template = [
          {
            label: 'Upgrade...',
            click: () => onOpenDialogLicenseRegistration(),
            visible: !registered,
          },
          {
            type: 'separator',
            visible: !registered,
          },
          {
            label: 'Profile',
            click: () => requestOpenInBrowser('https://webcatalog.io/account/settings/profile/'),
          },
          {
            label: 'Password',
            click: () => requestOpenInBrowser('https://webcatalog.io/account/settings/password/'),
          },
          {
            label: 'Plans & Billing',
            click: () => requestOpenInBrowser('https://webcatalog.io/account/settings/billing/'),
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
      title={`${displayName} (${displayedPlan})`}
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
  );

  if (showTooltip) {
    return (
      <Tooltip title={displayName} placement="right" arrow>
        {accountListItem}
      </Tooltip>
    );
  }
  return accountListItem;
};

SectionAccount.defaultProps = {
  currentPlan: 'basic',
  displayName: '',
  isSignedIn: false,
  photoURL: null,
  registered: false,
};

SectionAccount.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPlan: PropTypes.string,
  displayName: PropTypes.string,
  isSignedIn: PropTypes.bool,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
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

const actionCreators = {
  openDialogLicenseRegistration,
};

export default connectComponent(
  SectionAccount,
  mapStateToProps,
  actionCreators,
  styles,
);
