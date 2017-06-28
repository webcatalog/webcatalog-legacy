/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import SvgIcon from 'material-ui/SvgIcon';
import TextField from 'material-ui/TextField';

import logoPng from '../../images/logo.png';

import { setAuthEmail, setAuthPassword } from '../../actions/auth';

const GOOGLE_BRAND_COLOR = '#fff';

const styleSheet = createStyleSheet('Auth', theme => ({
  root: {
    flex: 1,
    backgroundColor: grey[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  card: {
    width: 320,
    minHeight: 400,
    padding: theme.spacing.unit * 3,
    boxSizing: 'border-box',
    textAlign: 'center',
    WebkitAppRegion: 'no-drag',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
    },
  },
  logo: {
    height: 64,
    width: 252,
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
    color: theme.palette.getContrastText(GOOGLE_BRAND_COLOR),
    backgroundColor: GOOGLE_BRAND_COLOR,
    width: '100%',
    '&:hover': {
      backgroundColor: GOOGLE_BRAND_COLOR,
    },
  },
}));

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
    emailErr,
    onSetEmail,
    onSetPassword,
    password,
    passwordErr,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.card} elevation={4}>
        <img src={logoPng} alt="WebCatalog" className={classes.logo} />

        <TextField
          className={classes.textField}
          error={Boolean(emailErr)}
          helperText={emailErr}
          id="email"
          label="Email"
          onChange={event => onSetEmail(event.target.value)}
          type="email"
          value={email}
        />

        <TextField
          className={classes.textField}
          error={Boolean(passwordErr)}
          helperText={passwordErr}
          id="password"
          label="Password"
          onChange={event => onSetPassword(event.target.value)}
          type="password"
          value={password}
        />

        <Button raised color="primary" className={classes.signInButton}>Sign in</Button>

        <Button>Create an account</Button>

        <Button>Forgot your password?</Button>

        <Divider className={classes.divider} />

        <Button raised className={classes.googleButton} onClick={() => ipcRenderer.send('sign-in-with-google')}>
          <GoogleIcon />
          <span className={classes.oauthText}>Sign in with Google</span>
        </Button>
      </Paper>
    </div>
  );
};

Auth.defaultProps = {
  emailErr: null,
  passwordErr: null,
};

Auth.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  emailErr: PropTypes.string,
  onSetEmail: PropTypes.func.isRequired,
  onSetPassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  passwordErr: PropTypes.string,
};

const mapStateToProps = state => ({
  email: state.auth.email,
  emailErr: state.auth.emailErr,
  password: state.auth.password,
  passwordErr: state.auth.passwordErr,
});

const mapDispatchToProps = dispatch => ({
  onSetEmail: email => dispatch(setAuthEmail(email)),
  onSetPassword: password => dispatch(setAuthPassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Auth));
