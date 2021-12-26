/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import connectComponent from '../../helpers/connect-component';
import { close } from '../../state/dialog-upgrade/actions';
import { requestOpenInBrowser, requestSignInWithPopup } from '../../senders';
import { open as openDialogLicenseRegistration } from '../../state/dialog-license-registration/actions';
import { getCurrentPlan } from '../../state/user/utils';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyles = makeStyles((theme) => ({
  dialogContentText: {
    marginTop: theme.spacing(2),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const DialogUpgrade = ({
  currentPlan,
  isSignedIn,
  open,
  onClose,
  onOpenDialogLicenseRegistration,
}) => {
  const classes = useStyles();

  let planName = 'Basic';
  if (currentPlan === 'pro') planName = 'Pro';
  else if (currentPlan === 'lifetime') planName = 'Lifetime';

  const handleUpgradeToPro = useCallback(() => {
    if (isSignedIn) {
      onClose();
      requestOpenInBrowser('https://webcatalog.io/account/settings/billing/?prompt=1');
      return;
    }

    window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
      title: 'Account Required',
      message: 'Please sign in before continuing.',
      buttons: ['Sign in', 'Later'],
      cancelId: 1,
      defaultId: 0,
    }).then(({ response }) => {
      if (response === 0) {
        // we don't use logging in with protocol webcatalog://
        // as it causes wrong Electron instance to be opened
        // e.g. it opens production app instead of dev env
        onClose();
        if (window.process.platform === 'linux' || process.env.NODE_ENV !== 'production') {
          requestSignInWithPopup();
          return;
        }
        requestOpenInBrowser('https://webcatalog.io/account/token/');
      }
    }).catch(console.log); // eslint-disable-line
  }, [isSignedIn, onClose]);

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} fullWidth maxWidth="sm">
      <EnhancedDialogTitle id="simple-dialog-title" onClose={onClose}>
        Current Plan: WebCatalog&nbsp;
        {planName}
      </EnhancedDialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>
          Your current plan
          has limitations and does not include some&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog/pricing/?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://webcatalog.io/webcatalog/pricing/?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            premium features
          </span>
          .
          To unlock them, please upgrade to one of the premium plans.
        </DialogContentText>
        <List>
          <ListItem button onClick={handleUpgradeToPro}>
            <ListItemText
              primary="WebCatalog Pro (5 USD per user, per month)"
              secondary="Unlock all features, INCLUDING cloud syncing."
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={onOpenDialogLicenseRegistration} disabled={currentPlan === 'lifetime'}>
            <ListItemText
              primary="WebCatalog Lifetime (40 USD per user, one-time payment)"
              secondary="Unlock most features, EXLCUDING cloud syncing."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog/pricing/?utm_source=webcatalog_app')}
          >
            Learn more about premium features...
          </Button>
        </div>
        <Button
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogUpgrade.defaultProps = {
  isSignedIn: false,
};

DialogUpgrade.propTypes = {
  currentPlan: PropTypes.string.isRequired,
  isSignedIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogUpgrade.open,
  currentPlan: getCurrentPlan(state),
  isSignedIn: state.user.isSignedIn,
});

const actionCreators = {
  close,
  openDialogLicenseRegistration,
};

export default connectComponent(
  DialogUpgrade,
  mapStateToProps,
  actionCreators,
);
