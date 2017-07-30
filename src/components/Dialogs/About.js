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

import { close } from '../../state/ui/dialogs/about/actions';

import iconSvg from '../../assets/icon.svg';

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
    textAlign: 'center',
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
    updaterStatus,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <DialogTitle>About</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog" />
        {updaterStatus}
      </DialogContent>
    </Dialog>
  );
};

About.defaultProps = {};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  updaterStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  updaterStatus: state.updater.status,
  open: state.ui.dialogs.about.open,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(About));
