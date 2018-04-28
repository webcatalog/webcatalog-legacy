import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import connectComponent from '../helpers/connect-component';

import { requestOpenInBrowser, requestOpenWebCatalog } from '../senders/generic';

import { checkForUpdates } from '../state/root/updater/actions';

import DialogAbout from './dialogs/about';
import UpdaterMessage from './root/updater-message';
import FakeTitleBar from './shared/fake-title-bar';

import {
  STRING_JUST_A_FRAMEWORK,
  STRING_DOWNLOAD_WEBCATALOG,
  STRING_OPEN_WEBCATALOG,
  STRING_CLI_AVAILABLE,
} from '../constants/strings';

const styles = theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
  },
  bottom: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  box: {
    textAlign: 'center',
  },
  continueButton: {
    marginLeft: theme.spacing.unit,
  },
  removeJuliApps: {
    marginTop: theme.spacing.unit * 2,
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class AppNoArgv extends React.Component {
  componentDidMount() {
    const { onCheckForUpdates } = this.props;
    onCheckForUpdates();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FakeTitleBar background="-webkit-linear-gradient(top, #ebebeb, #d5d5d5)" />
        <UpdaterMessage />
        <div className={classes.bottom}>
          <div className={classes.box}>
            <p>{STRING_JUST_A_FRAMEWORK}</p>

            <p>
              <Button
                variant="raised"
                color="primary"
                onClick={() => requestOpenInBrowser('https://getwebcatalog.com')}
              >
                {STRING_DOWNLOAD_WEBCATALOG}
              </Button>
              <Button
                variant="raised"
                className={classes.continueButton}
                onClick={requestOpenWebCatalog}
              >
                {STRING_OPEN_WEBCATALOG}
              </Button>
            </p>

            <p>
              <span
                role="link"
                onClick={() => requestOpenInBrowser('https://github.com/seaneking/juli-cli')}
                onKeyDown={() => requestOpenInBrowser('https://github.com/seaneking/juli-cli')}
                tabIndex="0"
                className={classes.link}
              >
                {STRING_CLI_AVAILABLE}
              </span>
            </p>
          </div>
        </div>
        <DialogAbout />
      </div>
    );
  }
}

AppNoArgv.propTypes = {
  classes: PropTypes.object.isRequired,
  onCheckForUpdates: PropTypes.func.isRequired,
};

const actionCreators = {
  checkForUpdates,
};

export default connectComponent(
  AppNoArgv,
  null,
  actionCreators,
  styles,
);
