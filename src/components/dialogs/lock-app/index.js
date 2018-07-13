import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import connectComponent from '../../../helpers/connect-component';

import { close } from '../../../state/dialogs/lock-app/actions';

import { STRING_LOCK_APP } from '../../../constants/strings';

import SetAPassword from './set-a-password';
import EnterCurrentPassword from './enter-current-password';
import PickAnOption from './pick-an-option';

const DialogLockApp = (props) => {
  const {
    onClose,
    open,
    mode,
  } = props;

  let content;
  switch (mode) {
    case 2:
      content = <PickAnOption />;
      break;
    case 1:
      content = <SetAPassword />;
      break;
    case 0:
    default:
      content = <EnterCurrentPassword />;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_LOCK_APP}
      </DialogTitle>
      {content}
    </Dialog>
  );
};

DialogLockApp.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  mode: PropTypes.number,
};

DialogLockApp.defaultProps = {
  open: false,
  mode: 0,
};

const mapStateToProps = state => ({
  open: state.dialogs.lockApp.open,
  mode: state.dialogs.lockApp.mode,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogLockApp,
  mapStateToProps,
  actionCreators,
  null,
);
