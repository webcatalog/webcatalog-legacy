/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { close } from '../../state/dialog-about/actions';
import { open as openDialogOpenSourceNotices } from '../../state/dialog-open-source-notices/actions';
import iconPng from '../../assets/webcatalog-mac-icon-128@2x.png';

import { requestOpenInBrowser } from '../../senders';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyle = makeStyles((theme) => ({
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

const DialogAbout = () => {
  const classes = useStyle();
  const dispatch = useDispatch();

  const appVersion = useMemo(() => window.remote.app.getVersion(), [window.remote.app]);

  const open = useSelector((state) => state.dialogAbout.open);

  const onClose = useCallback(() => dispatch(close()), [dispatch]);

  const onOpenDialogOpenSourceNotices = useCallback(
    () => dispatch(openDialogOpenSourceNotices), [dispatch],
  );
  const onOpenWebsite = useCallback(
    () => requestOpenInBrowser('https://webcatalog.app?utm_source=webcatalog_app'), [requestOpenInBrowser],
  );
  const onOpenHelp = useCallback(
    () => requestOpenInBrowser('https://help.webcatalog.app?utm_source=webcatalog_app'), [requestOpenInBrowser],
  );

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
        <img
          className={classes.icon}
          src={iconPng}
          alt="WebCatalog"
        />
        <Typography
          className={classes.title}
          variant="h6"
        >
          WebCatalog
        </Typography>
        <Typography
          className={classes.version}
          variant="body2"
        >
          {`Version v${appVersion} (${window.process.arch})`}
        </Typography>

        <Button onClick={onOpenWebsite}>
          Website
        </Button>

        <Button onClick={onOpenHelp}>
          Help
        </Button>

        <br />

        <Button onClick={onOpenDialogOpenSourceNotices}>
          Open Source Notices
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAbout;
