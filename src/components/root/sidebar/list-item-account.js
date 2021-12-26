/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import { getAuth } from 'firebase/auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import {
  requestOpenInBrowser,
} from '../../../senders';

import { open as openDialogUpgrade } from '../../../state/dialog-upgrade/actions';
import { getCurrentPlan } from '../../../state/user/utils';

import connectComponent from '../../../helpers/connect-component';

import '../../../firebase';

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemSelected: {
    backgroundColor: `${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.grey[900]} !important`,
  },
  listItemIcon: {
    color: theme.palette.common.white,
    margin: '0 auto',
    minWidth: 'auto',
  },
  listItemText: {
    textAlign: 'center',
    width: '100%',
  },
  listItemTextPrimary: theme.typography.body2,
});

const SectionAccount = ({
  classes,
  onOpenDialogUpgrade,
  currentPlan,
  displayName,
  isSignedIn,
  photoURL,
}) => {
  let planName = 'Basic';
  if (currentPlan === 'pro') planName = 'Pro';
  else if (currentPlan === 'lifetime') planName = 'Lifetime';

  const accountListItem = (
    <ListItem
      button
      alignItems="flex-start"
      onClick={() => {
        const template = [
          {
            label: 'Upgrade...',
            click: () => onOpenDialogUpgrade(),
            visible: currentPlan !== 'pro',
          },
          {
            type: 'separator',
            visible: currentPlan !== 'pro',
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
            label: 'Plans and Billing',
            click: () => requestOpenInBrowser('https://webcatalog.io/account/settings/billing/'),
          },
          {
            type: 'separator',
          },
          {
            label: 'Log Out',
            click: () => getAuth().signOut(),
          },
        ];

        const menu = window.remote.Menu.buildFromTemplate(template);
        menu.popup(window.remote.getCurrentWindow());
      }}
      title={displayName}
      classes={{
        root: classes.listItem,
        selected: classes.listItemSelected,
      }}
    >
      <ListItemAvatar classes={{ root: classes.listItemIcon }}>
        <Avatar alt={displayName} src={photoURL} />
      </ListItemAvatar>
      <ListItemText
        primary={planName}
        classes={{
          root: classes.listItemText,
          primary: classes.listItemTextPrimary,
        }}
      />
    </ListItem>
  );

  return (
    <>
      {currentPlan === 'basic' && (
        <div className={classes.container}>
          <Button size="small" onClick={() => onOpenDialogUpgrade()} color="inherit">
            Upgrade
          </Button>
        </div>
      )}
      {isSignedIn && accountListItem}
    </>
  );
};

SectionAccount.defaultProps = {
  displayName: '',
  isSignedIn: false,
  photoURL: null,
};

SectionAccount.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPlan: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  isSignedIn: PropTypes.bool,
  onOpenDialogUpgrade: PropTypes.func.isRequired,
  photoURL: PropTypes.string,
};

const mapStateToProps = (state) => ({
  currentPlan: getCurrentPlan(state),
  displayName: state.user.displayName,
  isSignedIn: state.user.isSignedIn,
  photoURL: state.user.photoURL,
});

const actionCreators = {
  openDialogUpgrade,
};

export default connectComponent(
  SectionAccount,
  mapStateToProps,
  actionCreators,
  styles,
);
