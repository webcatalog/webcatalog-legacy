/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';

import common from 'material-ui/colors/common';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import SvgIcon from 'material-ui/SvgIcon';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';

import connectComponent from '../../helpers/connect-component';

import logoPng from '../../assets/logo.png';

import {
  submit,
  formUpdate,
} from '../../state/pages/log-in/actions';

import {
  STRING_CONTINUE_WITHOUT_LOGGING_IN,
  STRING_CREATE_ACCOUNT,
  STRING_EMAIL,
  STRING_FORGOT_PASSWORD,
  STRING_LOG_IN_WITH_GOOGLE,
  STRING_LOG_IN,
  STRING_PASSWORD,
} from '../../constants/strings';

const GOOGLE_BRAND_COLOR = '#4285F4';
const { fullWhite } = common;

const styles = theme => ({
  root: {
    flex: 1,
    backgroundColor: fullWhite,
    display: 'flex',
    flexDirection: 'column',
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 340,
    minHeight: 400,
    padding: theme.spacing.unit * 3,
    boxSizing: 'border-box',
    textAlign: 'center',
    WebkitAppRegion: 'no-drag',
    [theme.breakpoints.down('sm')]: {
      boxShadow: 'none',
    },
  },
  logo: {
    height: 64,
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    textAlign: 'left',
  },
  signInButton: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 4,
  },
  oauthText: {
    flex: 1,
  },
  oauthIconContainer: {
    flexBasis: 24,
    width: 24,
    height: 24,
  },
  googleButton: {
    padding: 0,
    border: `1px solid ${GOOGLE_BRAND_COLOR}`,
    color: theme.palette.getContrastText(GOOGLE_BRAND_COLOR),
    backgroundColor: GOOGLE_BRAND_COLOR,
    width: '100%',
    '&:hover': {
      backgroundColor: GOOGLE_BRAND_COLOR,
    },
  },
  googleIcon: {
    backgroundColor: fullWhite,
    padding: 11,
    borderRadius: 2,
  },
  bottomContainer: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: fullWhite,
  },
});

/* eslint-disable max-len */
const GoogleIcon = () => (
  <SvgIcon viewBox="0 0 18 18" style={{ height: 18, width: 18 }}>
    <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" fillRule="nonzero" />
    <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" id="Shape" fill="#34A853" fillRule="nonzero" />
    <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" id="Shape" fill="#FBBC05" fillRule="nonzero" />
    <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" id="Shape" fill="#EA4335" fillRule="nonzero" />
  </SvgIcon>
);
/* eslint-enable max-len */

const Auth = (props) => {
  const {
    classes,
    email,
    emailError,
    onFormUpdate,
    onSubmit,
    password,
    passwordError,
    isSubmitting,
  } = props;

  if (isSubmitting) {
    return (
      <div className={classes.circularProgressContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.cardContainer}>
        <div className={classes.card}>
          <img src={logoPng} alt="WebCatalog" className={classes.logo} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <TextField
              className={classes.textField}
              error={Boolean(emailError)}
              helperText={emailError}
              id="email"
              label={STRING_EMAIL}
              onChange={e => onFormUpdate({ email: e.target.value })}
              type="email"
              value={email}
            />

            <TextField
              className={classes.textField}
              error={Boolean(passwordError)}
              helperText={passwordError}
              id="password"
              label={STRING_PASSWORD}
              onChange={e => onFormUpdate({ password: e.target.value })}
              type="password"
              value={password}
            />

            <Button
              raised
              color="primary"
              className={classes.signInButton}
              type="submit"
            >
              {STRING_LOG_IN}
            </Button>
          </form>

          <Button onClick={() => ipcRenderer.send('sign-up')}>
            {STRING_CREATE_ACCOUNT}
          </Button>

          <Button onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/auth/reset-password')}>
            {STRING_FORGOT_PASSWORD}
          </Button>

          <Divider className={classes.divider} />

          <Button
            raised
            className={classes.googleButton}
            onClick={() => ipcRenderer.send('sign-in-with-google')}
            color="primary"
          >
            <div className={classes.googleIcon}>
              <GoogleIcon />
            </div>
            <span className={classes.oauthText}>{STRING_LOG_IN_WITH_GOOGLE}</span>
          </Button>
        </div>
      </div>

      <div className={classes.bottomContainer}>
        <Button
          onClick={() => ipcRenderer.send('write-token-to-disk', 'anonymous')}
        >
          {STRING_CONTINUE_WITHOUT_LOGGING_IN}
        </Button>
      </div>
    </div>
  );
};

Auth.defaultProps = {
  emailError: null,
  passwordError: null,
  isSubmitting: false,
};

Auth.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string,
  onFormUpdate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string,
  isSubmitting: PropTypes.boolean,
};

const mapStateToProps = state => ({
  email: state.pages.logIn.form.email,
  emailError: state.pages.logIn.form.emailError,
  password: state.pages.logIn.form.password,
  passwordError: state.pages.logIn.form.passwordError,
  isSubmitting: state.pages.logIn.isSubmitting,
});

const actionCreators = {
  formUpdate,
  submit,
};

export default connectComponent(
  Auth,
  mapStateToProps,
  actionCreators,
  styles,
);
