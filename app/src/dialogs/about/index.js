import React from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';

import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';
import { getLatestVersion } from '../../state/root/version/actions';

import {
  STRING_ABOUT,
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_PRIVACY_POLICY,
  STRING_RELEASE_NOTES,
  STRING_TERMS,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_NOT_AVAILABLE,
} from '../../constants/strings';

import {
  requestOpenInBrowser,
} from '../../senders/generic';

import EnhancedDialogTitle from '../../shared/enhanced-dialog-title';

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
    isGettingVersion,
    latestMoleculeVersion,
    onClose,
    onGetLatestVersion,
    open,
  } = props;

  // check for update
  const currentVersion = window.packageJson.version;
  const isLatestVersion = semver.gte(currentVersion, latestMoleculeVersion);

  let versionStatusMessage = STRING_UPDATE_NOT_AVAILABLE;
  if (isGettingVersion) versionStatusMessage = STRING_CHECKING_FOR_UPDATES;
  else if (!isLatestVersion) versionStatusMessage = STRING_UPDATE_AVAILABLE;

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
        <img
          alt={window.shellInfo.name}
          className={classes.icon}
          src={`https://s3.getwebcatalog.com/${window.shellInfo.id}.png`}
        />
        <Typography type="title" className={classes.title}>{window.shellInfo.name}</Typography>
        <Typography type="body1" className={classes.version}>
          powered by WebCatalog + Molecule
        </Typography>

        <Typography type="body1" className={classes.updaterStatus}>
          {versionStatusMessage}
        </Typography>

        <Button
          color="primary"
          disabled={isGettingVersion}
          onClick={() => onGetLatestVersion()}
          raised
        >
          {STRING_CHECK_FOR_UPDATES}
        </Button>

        <Divider className={classes.divider} />

        <div className={classes.versionSmallContainer}>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>molecule:</strong> {currentVersion}
          </Typography>
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

About.defaultProps = {
  latestMoleculeVersion: '1.0.0',
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  isGettingVersion: PropTypes.bool.isRequired,
  latestMoleculeVersion: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onGetLatestVersion: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isGettingVersion: state.version.isGetting,
  latestMoleculeVersion: state.version.moleculeVersion,
  open: state.dialogs.about.open,
});

const actionCreators = {
  close,
  getLatestVersion,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
