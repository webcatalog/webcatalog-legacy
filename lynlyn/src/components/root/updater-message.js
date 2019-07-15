import React from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import blueGrey from '@material-ui/core/colors/blueGrey';

import connectComponent from '../../helpers/connect-component';

import { UPDATE_DOWNLOADED } from '../../constants/updater-statuses';

import {
  STRING_UPDATE_AND_RELAUNCH,
  STRING_UPDATE_DOWNLOADED,
  STRING_WHATS_NEW,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';
import { requestQuitAndInstall } from '../../senders/updater';

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

  if (updaterStatus === UPDATE_DOWNLOADED) {
    return (
      <div className={classes.updaterPaper}>
        <span>{STRING_UPDATE_DOWNLOADED} </span>
        <Button
          variant="raised"
          className={classes.updaterPaperLink}
          onClick={() => requestOpenInBrowser('https://github.com/quanglam2807/lynlyn/releases')}
        >
          {STRING_WHATS_NEW}
        </Button>
        <Button
          variant="raised"
          className={classes.updaterPaperLink}
          onClick={() => requestQuitAndInstall()}
        >
          {STRING_UPDATE_AND_RELAUNCH}
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
