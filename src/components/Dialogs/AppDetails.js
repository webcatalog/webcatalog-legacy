import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';

import FakeTitleBar from '../shared/FakeTitleBar';
import { close } from '../../actions/dialogs/app-details';

const styleSheet = createStyleSheet('AppDetails', {
  linearProgress: {
    opacity: 0,
  },
  dialogContent: {
    maxWidth: 288,
  },
  title: {
    marginRight: 24,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

const AppDetails = (props) => {
  const {
    classes,
    onClose,
    open,
    name,
    url,
  } = props;

  return (
    <Dialog
      fullScreen
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="up" />}
    >
      <FakeTitleBar />
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="contrast" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography type="title" color="inherit" className={classes.flex}>
            {name}
          </Typography>
          <Button color="contrast" onClick={onClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          {url}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AppDetails.defaultProps = {
  open: false,
};

AppDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form,
  } = state.dialogs.appDetails;

  const {
    name,
    url,
  } = form;

  return {
    open,
    name,
    url,
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(AppDetails));
