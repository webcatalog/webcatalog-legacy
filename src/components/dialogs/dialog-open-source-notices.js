/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core';

import { close } from '../../state/dialog-open-source-notices/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyle = makeStyles((theme) => ({
  dialogContent: {
    minWidth: 320,
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
  },
}));

const DialogOpenSourceNotices = () => {
  const classes = useStyle();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogEditApp.open);

  const onClose = useCallback(() => dispatch(close()), [dispatch]);

  const [content, setContent] = useState('');

  useEffect(async () => {
    try {
      const res = await window.fetch('./open-source-notices.txt');
      const text = await res.text();

      setContent(text);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Open Source Notices
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default DialogOpenSourceNotices;
