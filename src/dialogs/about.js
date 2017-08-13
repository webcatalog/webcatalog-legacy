/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import { close } from '../state/dialogs/about/actions';
import iconSvg from '../assets/icon.svg';
import {
  CHECKING_FOR_UPDATES,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  UPDATE_ERROR,
  UPDATE_NOT_AVAILABLE,
  UPDATE_PROGRESS,
} from '../constants/updater-statuses';
import {
  STRING_ABOUT,
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_PRIVACY_POLICY,
  STRING_QUIT_AND_INSTALL,
  STRING_RELEASE_NOTES,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_DOWNLOADED,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_UPDATE_PROGRESS,
} from '../constants/strings';

const styleSheet = createStyleSheet('About', {
  icon: {
    height: 128,
    width: 128,
  },
  dialogContent: {
    minWidth: 240,
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
  },
  version: {
    marginBottom: 16,
  },
  updaterStatus: {
    marginTop: 32,
    marginBottom: 12,
  },
});

const About = (props) => {
  const {
    classes,
    onClose,
    open,
    updaterStatus,
  } = props;

  let updaterStatusMessage;
  switch (updaterStatus) {
    case CHECKING_FOR_UPDATES:
      updaterStatusMessage = STRING_CHECKING_FOR_UPDATES;
      break;
    case UPDATE_AVAILABLE:
      updaterStatusMessage = STRING_UPDATE_AVAILABLE;
      break;
    case UPDATE_ERROR:
      updaterStatusMessage = STRING_UPDATE_ERROR;
      break;
    case UPDATE_PROGRESS:
      updaterStatusMessage = STRING_UPDATE_PROGRESS;
      break;
    case UPDATE_DOWNLOADED:
      updaterStatusMessage = STRING_UPDATE_DOWNLOADED;
      break;
    case UPDATE_NOT_AVAILABLE:
    default:
      updaterStatusMessage = STRING_UPDATE_NOT_AVAILABLE;
  }

  const isUpdaterRunning = updaterStatus === CHECKING_FOR_UPDATES
    || updaterStatus === UPDATE_PROGRESS;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <DialogTitle>{STRING_ABOUT}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog" className={classes.icon} />
        <Typography type="title" className={classes.title}>WebCatalog</Typography>
        <Typography type="body1" className={classes.version}>Version {window.version}</Typography>

        <Button
          onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/release-notes')}
        >
          {STRING_RELEASE_NOTES}
        </Button>

        <Button
          onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/privacy')}
        >
          {STRING_PRIVACY_POLICY}
        </Button>

        <Typography type="body1" className={classes.updaterStatus}>
          {updaterStatusMessage}
        </Typography>

        {updaterStatus === UPDATE_DOWNLOADED ? (
          <Button
            raised
            color="primary"
            onClick={() => ipcRenderer.send('quit-and-install')}
          >
            {STRING_QUIT_AND_INSTALL}
          </Button>
        ) : (
          <Button
            raised
            color="primary"
            disabled={isUpdaterRunning}
            onClick={() => ipcRenderer.send('check-for-updates')}
          >
            {STRING_CHECK_FOR_UPDATES}
          </Button>
        )}

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
  open: state.dialogs.about.open,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(About));
