import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../helpers/connect-component';

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
  STRING_TERMS,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_DOWNLOADED,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_UPDATE_PROGRESS,
} from '../constants/strings';

import {
  requestOpenInBrowser,
} from '../senders/generic';
import {
  requestCheckForUpdates,
  requestQuitAndInstall,
} from '../senders/updater';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = {
  icon: {
    height: 128,
    width: 128,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
  },
  version: {
    marginBottom: 16,
  },
  versionSmallContainer: {
    marginBottom: 24,
  },
  versionSmall: {
    fontSize: 13,
  },
  updaterStatus: {
    marginTop: 32,
    marginBottom: 12,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
  },
};

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
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog" className={classes.icon} />
        <Typography type="title" className={classes.title}>WebCatalog</Typography>
        <Typography type="body1" className={classes.version}>Version {window.version}</Typography>

        <Typography type="body1" className={classes.updaterStatus}>
          {updaterStatusMessage}
        </Typography>

        {updaterStatus === UPDATE_DOWNLOADED ? (
          <Button
            color="primary"
            onClick={requestQuitAndInstall}
            raised
          >
            {STRING_QUIT_AND_INSTALL}
          </Button>
        ) : (
          <Button
            color="primary"
            disabled={isUpdaterRunning}
            onClick={requestCheckForUpdates}
            raised
          >
            {STRING_CHECK_FOR_UPDATES}
          </Button>
        )}

        <Divider className={classes.divider} />

        <div className={classes.versionSmallContainer}>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>electron:</strong> {window.versions.electron}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>chrome:</strong> {window.versions.chrome}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>v8:</strong> {window.versions.v8}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>node:</strong> {window.versions.node}
          </Typography>
        </div>

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/release-notes')}
        >
          {STRING_RELEASE_NOTES}
        </Button>
        <br />

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/terms')}
        >
          {STRING_TERMS}
        </Button>
        <br />

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/privacy')}
        >
          {STRING_PRIVACY_POLICY}
        </Button>

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

const actionCreators = {
  close,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
