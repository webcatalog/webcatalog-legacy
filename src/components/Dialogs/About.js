import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Slide from 'material-ui/transitions/Slide';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import { close } from '../../actions/dialogs/about';

const styleSheet = createStyleSheet('About', {
  linearProgress: {
    opacity: 0,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  dialogContent: {
    minWidth: 240,
  },
  textField: {
    width: '100%',
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
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="down" />}
    >
      <DialogTitle>About</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        Test
      </DialogContent>
    </Dialog>
  );
};

About.defaultProps = {
};

About.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.about.open,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(About));
