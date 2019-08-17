import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders';

const { remote } = window.require('electron');

const appVersion = remote.app.getVersion();
const appJson = remote.getGlobal('appJson');

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

const About = (props) => {
  const {
    classes,
  } = props;

  return (
    <div>
      <DialogContent className={classes.dialogContent}>
        <img src={`file://${window.iconPath}`} alt="WebCatalog" className={classes.icon} />
        <Typography variant="title" className={classes.title}>{appJson.name}</Typography>
        <Typography
          variant="body1"
          className={classes.version}
        >
          {`Version v${appVersion}. Powered by WebCatalog.`}
        </Typography>

        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com')}
        >
          WebCatalog Website
        </Button>
        <br />
        <Button
          onClick={() => requestOpenInBrowser('https://getwebcatalog.com/support')}
        >
          WebCatalog Support
        </Button>

        <Typography variant="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤</span>
          <span> by </span>
          <span
            onClick={() => requestOpenInBrowser('https://quanglam2807.github.io/')}
            onKeyDown={() => requestOpenInBrowser('https://quanglam2807.github.io/')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Quang Lam
          </span>
        </Typography>
      </DialogContent>
    </div>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  About,
  null,
  null,
  styles,
);
