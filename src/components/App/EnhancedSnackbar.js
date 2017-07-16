import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import { closeSnackbar } from '../../actions/snackbar';

const EnhancedSnackbar = (props) => {
  const {
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
      autoHideDuration={6e3}
      onRequestClose={onCloseSnackbar}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={message}
      action={(
        <Button color="accent" dense onClick={onCloseSnackbar}>
          Close
        </Button>
      )}
    />
  );
};

const mapStateToProps = state => ({
  open: state.snackbar.open,
  message: state.snackbar.message,
});

EnhancedSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.bool.isRequired,
  onCloseSnackbar: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onCloseSnackbar: () => dispatch(closeSnackbar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedSnackbar);
