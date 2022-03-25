/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { app } from '@electron/remote';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { close } from '../../state/dialog-about/actions';
import { open as openDialogOpenSourceNotices } from '../../state/dialog-open-source-notices/actions';
import iconPng from '../../assets/webcatalog-mac-icon-128@2x.png';

import { requestOpenInBrowser } from '../../senders';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyles = makeStyles((theme) => ({
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
}));

const About = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.dialogAbout.open);

  const appVersion = app.getVersion();

  return (
    <Dialog
      className={classes.root}
      onClose={() => dispatch(close())}
      open={open}
    >
      <EnhancedDialogTitle onClose={() => dispatch(close())}>
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
          onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog/?utm_source=webcatalog_app')}
        >
          Website
        </Button>

        <Button
          onClick={() => requestOpenInBrowser('https://docs.webcatalog.io?utm_source=webcatalog_app')}
        >
          Help
        </Button>

        <br />

        <Button
          onClick={() => dispatch(openDialogOpenSourceNotices())}
        >
          Open Source Notices
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default About;
