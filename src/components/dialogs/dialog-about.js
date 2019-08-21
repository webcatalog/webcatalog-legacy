import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-about/actions';
import iconPng from '../../assets/icon.png';

import { requestOpenInBrowser } from '../../senders';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const { remote } = window.require('electron');

const appVersion = remote.app.getVersion();

const styles = (theme) => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
  },
  title: {
    marginTop: theme.spacing.unit,
  },
  version: {
    marginBottom: theme.spacing.unit * 2,
  },
  versionSmallContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  versionSmall: {
    fontSize: 13,
  },
  goToTheWebsiteButton: {
    marginRight: theme.spacing.unit,
  },
  madeBy: {
    marginTop: theme.spacing.unit * 2,
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

/* eslint-disable react/jsx-props-no-spreading */
const Transition = (props) => <Slide direction="left" {...props} />;
/* eslint-enable react/jsx-props-no-spreading */

const About = (props) => {
  const {
    classes,
    onClose,
    open,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onClose={onClose}>
        About
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconPng} alt="WebCatalog" className={classes.icon} />
        <Typography variant="title" className={classes.title}>WebCatalog</Typography>
        <Typography
          variant="body1"
          className={classes.version}
        >
          {`Version v${appVersion}`}
        </Typography>

        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com')}
        >
          Website
        </Button>

        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com/support')}
        >
          Support
        </Button>

        <Typography variant="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤</span>
          <span> by </span>
          <span
            onClick={() => requestOpenInBrowser('https://quanglam2807.com/')}
            onKeyDown={() => requestOpenInBrowser('https://quanglam2807.com/')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Quang Lam
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogAbout.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
