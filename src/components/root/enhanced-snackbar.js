import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import connectComponent from '../../helpers/connect-component';

import { closeSnackbar } from '../../state/root/snackbar/actions';

const EnhancedSnackbar = (props) => {
  const {
    actionText,
    open,
    message,
    onCloseSnackbar,
  } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={20e3}
      onClose={onCloseSnackbar}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={message}
      action={
        <Button color="accent" size="small" onClick={onCloseSnackbar}>
          {actionText}
        </Button>
      }
    />
  );
};

const mapStateToProps = state => ({
  actionText: state.snackbar.actionText,
  open: state.snackbar.open,
  message: state.snackbar.message,
});

EnhancedSnackbar.defaultProps = {
  message: '',
};

EnhancedSnackbar.propTypes = {
  actionText: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onCloseSnackbar: PropTypes.func.isRequired,
};

const actionCreators = {
  closeSnackbar,
};

export default connectComponent(
  EnhancedSnackbar,
  mapStateToProps,
  actionCreators,
);
