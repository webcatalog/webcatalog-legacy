import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';
import { checkForLinuxUpdates } from '../../state/root/updater/actions';
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
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_GO_TO_THE_WEBSITE,
  STRING_PRIVACY_POLICY,
  STRING_RELEASE_NOTES,
  STRING_UPDATE_AND_RELAUNCH,
  STRING_TERMS,
  STRING_UPDATE_AVAILABLE_LINUX,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_DOWNLOADED,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_UPDATE_PROGRESS,
  STRING_WEBSITE,
} from '../../constants/strings';

import {
  requestOpenInBrowser,
} from '../../senders/generic';
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
    classes,
    onClose,
    onCheckForLinuxUpdates,
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
      if (window.platform === 'linux') {
        updaterStatusMessage = STRING_UPDATE_AVAILABLE_LINUX;
      } else {
        updaterStatusMessage = STRING_UPDATE_AVAILABLE;
      }
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
    || (window.platform !== 'linux' && updaterStatus === UPDATE_AVAILABLE)
  );

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog" className={classes.icon} />
        <Typography type="title" className={classes.title}>WebCatalog</Typography>
        <Typography type="body1" className={classes.version}>Version {window.version}</Typography>

        <Typography type="body1" className={classes.updaterStatus}>
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

        {window.platform === 'linux' && updaterStatus === UPDATE_AVAILABLE && (
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.io')}
            className={classes.goToTheWebsiteButton}
            raised
          >
            {STRING_GO_TO_THE_WEBSITE}
          </Button>
        )}

        {updaterStatus === UPDATE_DOWNLOADED ? (
          <Button
            color="primary"
            onClick={requestQuitAndInstall}
            raised
          >
            {STRING_UPDATE_AND_RELAUNCH}
          </Button>
        ) : (
          <Button
            color="primary"
            disabled={isUpdaterRunning}
            onClick={() => {
              if (window.platform === 'linux') {
                onCheckForLinuxUpdates();
              } else {
                requestCheckForUpdates();
              }
            }}
            raised
          >
            {STRING_CHECK_FOR_UPDATES}
          </Button>
        )}

        <div className={classes.versionSmallContainer}>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>electron:</strong> {window.versions.electron}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>chrome:</strong> {window.versions.chrome}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>node:</strong> {window.versions.node}
          </Typography>
        </div>

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io')}
        >
          {STRING_WEBSITE}
        </Button>

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

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/privacy')}
        >
          {STRING_PRIVACY_POLICY}
        </Button>

        <Typography type="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤️</span>
          <span> by </span>
          <a
            onClick={() => requestOpenInBrowser('https://quang.im')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Quang Lam
          </a>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

About.defaultProps = {
  updaterData: {},
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckForLinuxUpdates: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  updaterData: PropTypes.object,
  updaterStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.about.open,
  updaterData: state.updater.data,
  updaterStatus: state.updater.status,
});

const actionCreators = {
  close,
  checkForLinuxUpdates,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
