/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import connectComponent from '../../../../helpers/connect-component';
import { close } from '../../../../state/dialog-add-space/actions';

import Home from './home';

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogAddSpace = ({ open, onClose, classes }) => (
  <Dialog onClose={onClose} aria-labelledby="dialog-add-space-title" open={open} fullWidth maxWidth="sm">
    <DialogTitle id="dialog-add-space-title" onClose={onClose}>
      <Typography variant="h6">Add Space</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
    <DialogContent dividers>
      {open && <Home />}
    </DialogContent>
  </Dialog>
);

DialogAddSpace.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogAddSpace.open,
});

const actionCreator = {
  close,
};

export default connectComponent(
  DialogAddSpace,
  mapStateToProps,
  actionCreator,
  styles,
);
