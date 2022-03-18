/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import makeStyles from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import { close } from '../../../../state/dialog-add-space/actions';

import Home from './home';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const DialogAddSpace = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.dialogAddSpace.open);

  return (
    <Dialog
      onClose={() => dispatch(close())}
      aria-labelledby="dialog-add-space-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="dialog-add-space-title" onClose={() => dispatch(close())}>
        <Typography variant="h6">Add Space</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={() => dispatch(close())}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {open && <Home />}
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSpace;
