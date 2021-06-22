/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-about/actions';
import { open as openDialogOpenSourceNotices } from '../../state/dialog-open-source-notices/actions';
import iconPng from '../../assets/webcatalog-mac-icon-128@2x.png';

import { requestOpenInBrowser } from '../../senders';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(1),
  },
  version: {
    marginBottom: theme.spacing(2),
  },
  versionSmallContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  versionSmall: {
    fontSize: 13,
  },
  goToTheWebsiteButton: {
    marginRight: theme.spacing(1),
  },
  madeBy: {
    marginTop: theme.spacing(2),
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const About = ({
  classes,
  onClose,
  onOpenDialogOpenSourceNotices,
  open,
}) => {
  const appVersion = window.remote.app.getVersion();

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        About
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconPng} alt="WebCatalog" className={classes.icon} />
        <Typography variant="h6" className={classes.title}>WebCatalog</Typography>
        <Typography
          variant="body2"
          className={classes.version}
        >
          {`Version v${appVersion} (${window.process.arch})`}
        </Typography>

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.app?utm_source=webcatalog_app')}
        >
          Website
        </Button>

        <Button
          onClick={() => requestOpenInBrowser('https://help.webcatalog.app?utm_source=webcatalog_app')}
        >
          Help
        </Button>

        <br />

        <Button
          onClick={onOpenDialogOpenSourceNotices}
        >
          Open Source Notices
        </Button>
      </DialogContent>
    </Dialog>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenDialogOpenSourceNotices: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogAbout.open,
});

const actionCreators = {
  close,
  openDialogOpenSourceNotices,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
