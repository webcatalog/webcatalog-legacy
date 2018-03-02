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

import { close } from '../../state/dialogs/clear-browsing-data/actions';

import { requestClearBrowsingData } from '../../senders/generic';

import {
  STRING_ARE_YOU_SURE,
  STRING_CANCEL,
  STRING_CLEAR_BROWSING_DATA_DIALOG_DESC,
  STRING_CLEAR_BROWSING_DATA,
} from '../../constants/strings';

const DialogClearBrowsingData = (props) => {
  const {
    open,
    onClose,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_ARE_YOU_SURE}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {STRING_CLEAR_BROWSING_DATA_DIALOG_DESC}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            requestClearBrowsingData();
            onClose();
          }}
        >
          {STRING_CLEAR_BROWSING_DATA}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogClearBrowsingData.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

DialogClearBrowsingData.defaultProps = {
  open: false,
};

const mapStateToProps = state => ({
  open: state.dialogs.clearBrowsingData.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogClearBrowsingData,
  mapStateToProps,
  actionCreators,
);
