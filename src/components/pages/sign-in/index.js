/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import HelpIcon from '@material-ui/icons/Help';

import connectComponent from '../../../helpers/connect-component';
import { requestOpenInBrowser } from '../../../senders';

import logoWhitePng from '../../../assets/logo-white.png';

const styles = (theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.palette.primary.dark,
    display: 'flex',
    flexDirection: 'column',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  draggableTop: {
    userSelect: 'none',
    width: '100%',
    height: 32,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
  },
  center: {
    width: 500,
  },
  logo: {
    height: 40,
    userSelect: 'none',
  },
  title: {
    fontFamily: '"IBM Plex Sans"',
    fontWeight: 500,
    fontSize: '2.5rem',
    color: theme.palette.common.white,
    marginTop: theme.spacing(4),
    userSelect: 'none',
  },
  button: {
    marginTop: theme.spacing(4),
    minWidth: 240,
    WebkitAppRegion: 'no-drag',
  },
  helperText: {
    marginTop: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    userSelect: 'none',
  },
  signUpText: {
    marginTop: theme.spacing(3),
    color: theme.palette.common.white,
    userSelect: 'none',
  },
  helpContainer: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    WebkitAppRegion: 'no-drag',
    color: theme.palette.common.white,
  },
});

const getDeviceName = () => {
  if (window.process.platform === 'win32') return 'PC';
  if (window.process.platform === 'linux') return 'Linux system';
  return 'Mac';
};

const SignIn = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.draggableTop} />
    <div className={classes.content}>
      <div className={classes.center}>
        <img draggable="false" src={logoWhitePng} alt="WebCatalog" className={classes.logo} />

        <Typography variant="h3" className={classes.title}>
          WebCatalog brings
          <br />
          thousands of apps
          <br />
          to your&nbsp;
          {getDeviceName()}
          .
        </Typography>

        <Button
          variant="contained"
          disableElevation
          size="large"
          className={classes.button}
          onClick={() => requestOpenInBrowser('https://accounts.webcatalog.app/token')}
        >
          Sign in to WebCatalog
        </Button>

        <Typography variant="body2" className={classes.helperText}>
          We&apos;ll take you to your web browser to sign in and then bring you back here.
        </Typography>

        <Typography variant="body2" className={classes.signUpText}>
          New to WebCatalog?&nbsp;
          <Button color="inherit" onClick={() => requestOpenInBrowser('https://accounts.webcatalog.app/token')}>
            Create an Account
          </Button>
        </Typography>
      </div>
      <div className={classes.helpContainer}>
        <Button
          color="inherit"
          startIcon={<HelpIcon />}
          onClick={() => requestOpenInBrowser('https://help.webcatalog.app')}
        >
          Help
        </Button>
      </div>
    </div>
  </div>
);

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

export default connectComponent(
  SignIn,
  mapStateToProps,
  null,
  styles,
);
