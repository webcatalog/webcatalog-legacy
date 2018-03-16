import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, { DialogContent } from 'material-ui/Dialog';

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
    onCheckForUpdates,
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
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="title" className={classes.title}>Juli</Typography>
        <Typography variant="body1" className={classes.version}>
          Version {window.version}
        </Typography>

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
            onClick={() => requestOpenInBrowser('https://meetjuli.com')}
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
          onClick={() => requestOpenInBrowser('https://meetjuli.com')}
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
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckForUpdates: PropTypes.func.isRequired,
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
  checkForUpdates,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
