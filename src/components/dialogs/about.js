import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, { DialogContent } from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';
import iconSvg from '../../assets/icon.svg';
import {
  CHECKING_FOR_UPDATES,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  UPDATE_ERROR,
  UPDATE_NOT_AVAILABLE,
  UPDATE_PROGRESS,
} from '../../constants/updater-statuses';
import {
  STRING_ABOUT,
  STRING_ACTIVATED,
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_UPDATE_AND_RELAUNCH,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_DOWNLOADED,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_UPDATE_PROGRESS,
  STRING_WEBSITE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';
import {
  requestCheckForUpdates,
  requestQuitAndInstall,
} from '../../senders/updater';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = theme => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
  },
  title: {
    marginTop: theme.spacing.unit,
  },
  version: {
    marginBottom: theme.spacing.unit * 2,
  },
  versionSmallContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  versionSmall: {
    fontSize: 13,
  },
  updaterStatus: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  goToTheWebsiteButton: {
    marginRight: theme.spacing.unit,
  },
  madeBy: {
    marginTop: theme.spacing.unit * 2,
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const Transition = props => <Slide direction="left" {...props} />;

const About = (props) => {
  const {
    activated,
    classes,
    onClose,
    open,
    updaterData,
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

  const isUpdaterRunning = (
    updaterStatus === CHECKING_FOR_UPDATES
    || updaterStatus === UPDATE_PROGRESS
    || updaterStatus === UPDATE_DOWNLOADED
  );

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog Lite" className={classes.icon} />
        <Typography variant="title" className={classes.title}>WebCatalog Lite</Typography>
        <Typography
          variant="body1"
          className={classes.version}
        >
          Version {window.version}
        </Typography>

        <Typography variant="body1" className={classes.updaterStatus}>
          <span>{updaterStatusMessage}</span>
          {updaterStatus === UPDATE_AVAILABLE && updaterData.version && (
            <span>
              {` (${updaterData.version})`}
            </span>
          )}
          {updaterStatus === UPDATE_PROGRESS && updaterData.percent && (
            <span>
              {` (${updaterData.percent.toFixed(2)}%)`}
            </span>
          )}
        </Typography>

        {updaterStatus === UPDATE_DOWNLOADED ? (
          <Button
            color="primary"
            onClick={requestQuitAndInstall}
            variant="raised"
          >
            {STRING_UPDATE_AND_RELAUNCH}
          </Button>
        ) : (
          <Button
            color="primary"
            disabled={isUpdaterRunning}
            onClick={() => {
              requestCheckForUpdates();
            }}
            variant="raised"
          >
            {STRING_CHECK_FOR_UPDATES}
          </Button>
        )}

        <div className={classes.versionSmallContainer}>
          {activated && <p className={classes.versionSmall}>{STRING_ACTIVATED}</p>}
        </div>


        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com')}
        >
          {STRING_WEBSITE}
        </Button>

        <Typography variant="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤️</span>
          <span> by </span>
          <span
            onClick={() => requestOpenInBrowser('https://quang.im')}
            onKeyDown={() => requestOpenInBrowser('https://quang.im')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Quang Lam
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

About.defaultProps = {
  updaterData: {},
};

About.propTypes = {
  activated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  updaterData: PropTypes.object,
  updaterStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  activated: state.general.activated,
  open: state.dialogs.about.open,
  updaterData: state.updater.data,
  updaterStatus: state.updater.status,
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
