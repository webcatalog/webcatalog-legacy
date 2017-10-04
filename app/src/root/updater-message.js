import React from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';

import blueGrey from 'material-ui/colors/blueGrey';

import connectComponent from '../helpers/connect-component';

import {
  STRING_UPDATE_AVAILABLE,
} from '../constants/strings';

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
  const {
    classes,
    latestMoleculeVersion,
  } = props;

  // check for update
  const currentVersion = window.packageJson.version;
  const isLatestVersion = semver.gte(currentVersion, latestMoleculeVersion);

  if (isLatestVersion) {
    return null;
  }

  return (
    <div className={classes.updaterPaper}>
      {STRING_UPDATE_AVAILABLE}
    </div>
  );
};

UpdaterMessage.defaultProps = {
  latestMoleculeVersion: '1.0.0',
};

UpdaterMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  latestMoleculeVersion: PropTypes.string,
};

const mapStateToProps = state => ({
  latestMoleculeVersion: state.version.apiData.moleculeVersion,
});

export default connectComponent(
  UpdaterMessage,
  mapStateToProps,
  null,
  styles,
);
