/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-referral/actions';
import iconPng from '../../assets/products/webcatalog-mac-icon-128@2x.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import LinkSharing from '../shared/link-sharing';

const styles = (theme) => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    paddingBottom: theme.spacing(2),
  },
  shareInput: {
    marginTop: theme.spacing(4),
  },
});

const About = (props) => {
  const {
    classes,
    onClose,
    open,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      fullWidth
    >
      <EnhancedDialogTitle onClose={onClose}>
        Refer a Friend
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconPng} alt="WebCatalog" className={classes.icon} />
        <Typography variant="body1">Invite your friend and family to use WebCatalog. We are so grateful for the WebCatalog love that is shared across the world! </Typography>
        <LinkSharing url="https://webcatalog.app" className={classes.shareInput} />
      </DialogContent>
    </Dialog>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogReferral.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
