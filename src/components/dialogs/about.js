import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';
import { checkForUpdates } from '../../state/root/updater/actions';

import {
  CHECKING_FOR_UPDATES,
  UPDATE_AVAILABLE,
  UPDATE_ERROR,
  UPDATE_NOT_AVAILABLE,
} from '../../constants/updater-statuses';

import {
  STRING_ABOUT,
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_GO_TO_THE_WEBSITE,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_WEBSITE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = theme => ({
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

const About = (props) => {
  const {
    classes,
    onClose,
    open,
    updaterData,
    updaterStatus,
    onCheckForUpdates,
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
    case UPDATE_NOT_AVAILABLE:
    default:
      updaterStatusMessage = STRING_UPDATE_NOT_AVAILABLE;
  }

  const isUpdaterRunning = (
    updaterStatus === CHECKING_FOR_UPDATES
    || updaterStatus === UPDATE_AVAILABLE
  );

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        {window.shellInfo.name ? (
          <React.Fragment>
            <Typography variant="title" className={classes.title}>{window.shellInfo.name}</Typography>
            <Typography variant="body1" className={classes.version}>
              powered by Juli engine
              {' '}
              {window.version}
            </Typography>
          </React.Fragment>
        ) : (
          <Typography variant="title" className={classes.title}>
Juli
            {window.version}
          </Typography>
        )}

        <Typography variant="body1" className={classes.updaterStatus}>
          <span>{updaterStatusMessage}</span>
          {updaterStatus === UPDATE_AVAILABLE && updaterData.version && (
            <span>
              {` (${updaterData.version})`}
            </span>
          )}
        </Typography>

        {updaterStatus === UPDATE_AVAILABLE && (
          <Button
            onClick={() => requestOpenInBrowser('https://getwebcatalog.com/juli')}
            className={classes.goToTheWebsiteButton}
            variant="raised"
          >
            {STRING_GO_TO_THE_WEBSITE}
          </Button>
        )}

        <Button
          color="primary"
          disabled={isUpdaterRunning}
          onClick={onCheckForUpdates}
          variant="raised"
        >
          {STRING_CHECK_FOR_UPDATES}
        </Button>

        <div className={classes.versionSmallContainer} />

        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com/juli')}
        >
          {STRING_WEBSITE}
        </Button>

        <Typography variant="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤️</span>
          <span> by </span>
          <span
            onClick={() => requestOpenInBrowser('https://github.com/quanglam2807')}
            onKeyDown={() => requestOpenInBrowser('https://github.com/quanglam2807')}
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
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  updaterData: PropTypes.object,
  updaterStatus: PropTypes.string.isRequired,
  onCheckForUpdates: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.about.open,
  updaterData: state.updater.data,
  updaterStatus: state.updater.status,
});

const actionCreators = {
  close,
  checkForUpdates,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
