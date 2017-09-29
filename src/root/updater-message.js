import React from 'react';

import PropTypes from 'prop-types';

import blueGrey from 'material-ui/colors/blueGrey';

import connectComponent from '../helpers/connect-component';

import {
  UPDATE_DOWNLOADED,
} from '../constants/updater-statuses';

import {
  STRING_OR,
  STRING_RESTART_NOW,
  STRING_UPDATE_MESSAGE,
  STRING_WHATS_NEW,
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
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

const UpdaterMessage = (props) => {
  const { classes, updaterStatus } = props;

  if (updaterStatus !== UPDATE_DOWNLOADED) {
    return null;
  }

  return (
    <div className={classes.updaterPaper}>
      <span>{STRING_UPDATE_MESSAGE} </span>
      <a
        className={classes.updaterPaperLink}
        onClick={() => requestOpenInBrowser('https://webcatalog.io/release-notes')}
        role="link"
        tabIndex="0"
      >
        {STRING_WHATS_NEW}
      </a>
      <span> {STRING_OR} </span>
      <a
        className={classes.updaterPaperLink}
        onClick={() => requestQuitAndInstall()}
        role="link"
        tabIndex="0"
      >
        {STRING_RESTART_NOW}
      </a>
      <span>.</span>
    </div>
  );
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
