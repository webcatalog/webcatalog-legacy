import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/relaunch/actions';

import { requestRelaunch } from '../../senders/generic';

import {
  STRING_CANCEL,
  STRING_RELAUNCH_DESC,
  STRING_RELAUNCH,
} from '../../constants/strings';

const DialogRelaunch = (props) => {
  const {
    open,
    onClose,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_RELAUNCH}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {STRING_RELAUNCH_DESC}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onClose();
            requestRelaunch();
          }}
        >
          {STRING_RELAUNCH}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogRelaunch.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

DialogRelaunch.defaultProps = {
  open: false,
};

const mapStateToProps = state => ({
  open: state.dialogs.relaunch.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogRelaunch,
  mapStateToProps,
  actionCreators,
);
