import React from 'react';

import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import blueGrey from 'material-ui/colors/blueGrey';

import connectComponent from '../helpers/connect-component';

import {
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
} from '../constants/updater-statuses';

import {
  STRING_RESTART_NOW,
  STRING_UPDATE_DOWNLOADED,
  STRING_WHATS_NEW,
  STRING_GO_TO_THE_WEBSITE,
  STRING_UPDATE_AVAILABLE_LINUX,
} from '../constants/strings';

import { requestOpenInBrowser } from '../senders/generic';
import { requestQuitAndInstall } from '../senders/updater';

const styles = {
  updaterPaper: {
    boxSizing: 'border-box',
    backgroundColor: blueGrey[900],
    color: blueGrey[100],
    padding: '12px 24px',
    fontSize: '13.5px',
  },
  updaterPaperLink: {
    marginLeft: 12,
  },
};

const UpdaterMessage = (props) => {
  const { classes, updaterStatus } = props;

  if (window.platform === 'linux' && updaterStatus === UPDATE_AVAILABLE) {
    return (
      <div className={classes.updaterPaper}>
        <span>{STRING_UPDATE_AVAILABLE_LINUX} </span>
        <Button
          raised
          className={classes.updaterPaperLink}
          onClick={() => requestOpenInBrowser('https://webcatalog.io/release-notes')}
        >
          {STRING_WHATS_NEW}
        </Button>
        <Button
          raised
          className={classes.updaterPaperLink}
          onClick={() => requestOpenInBrowser('https://webcatalog.io')}
        >
          {STRING_GO_TO_THE_WEBSITE}
        </Button>
      </div>
    );
  }

  if (updaterStatus === UPDATE_DOWNLOADED) {
    return (
      <div className={classes.updaterPaper}>
        <span>{STRING_UPDATE_DOWNLOADED} </span>
        <Button
          raised
          className={classes.updaterPaperLink}
          onClick={() => requestOpenInBrowser('https://webcatalog.io/release-notes')}
        >
          {STRING_WHATS_NEW}
        </Button>
        <Button
          raised
          className={classes.updaterPaperLink}
          onClick={() => requestQuitAndInstall()}
        >
          {STRING_RESTART_NOW}
        </Button>
        <span>.</span>
      </div>
    );
  }

  return null;
};

UpdaterMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  updaterStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  updaterStatus: state.updater.status,
});

export default connectComponent(
  UpdaterMessage,
  mapStateToProps,
  null,
  styles,
);
