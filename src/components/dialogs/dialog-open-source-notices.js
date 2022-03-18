/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { close } from '../../state/dialog-open-source-notices/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    minWidth: 320,
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
  },
}));

const DialogOpenSourceNotices = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.dialogOpenSourceNotices.open);

  const [content, setContent] = useState('');
  useEffect(() => {
    window.fetch('./open-source-notices.txt')
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }, [setContent]);

  return (
    <Dialog
      className={classes.root}
      onClose={() => dispatch(close())}
      open={open}
    >
      <EnhancedDialogTitle onClose={() => dispatch(close())}>
        Open Source Notices
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default DialogOpenSourceNotices;
