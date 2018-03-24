import React from 'react';

import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import blueGrey from 'material-ui/colors/blueGrey';

import connectComponent from '../../helpers/connect-component';

import { UPDATE_AVAILABLE } from '../../constants/updater-statuses';

import {
  STRING_GO_TO_THE_WEBSITE,
  STRING_UPDATE_AVAILABLE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

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

  if (updaterStatus === UPDATE_AVAILABLE) {
    return (
      <div className={classes.updaterPaper}>
        <span>{STRING_UPDATE_AVAILABLE} </span>
        <Button
          variant="raised"
          className={classes.updaterPaperLink}
          onClick={() => requestOpenInBrowser('https://quang.im/juli')}
        >
          {STRING_GO_TO_THE_WEBSITE}
        </Button>
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
