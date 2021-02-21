/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-open-source-notices/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  dialogContent: {
    minWidth: 320,
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
  },
});

const DialogOpenSourceNotices = ({
  classes,
  onClose,
  open,
}) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    window.fetch('./open-source-notices.txt')
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
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

DialogOpenSourceNotices.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogOpenSourceNotices.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogOpenSourceNotices,
  mapStateToProps,
  actionCreators,
  styles,
);
