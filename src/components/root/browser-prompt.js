import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

import {
  STRING_SELECT_BROWSER,
  STRING_SELECT_BROWSER_DESC,
  STRING_SELECT_BROWSER_DESC_2,
  STRING_LEARN_MORE,
  STRING_RECOMMENDED,
} from '../../constants/strings';

import { updatePreference } from '../../state/root/preferences/actions';

import { requestOpenInBrowser } from '../../senders/generic';

import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';
import juliIcon from '../../assets/juli.png';
import firefoxIcon from '../../assets/firefox.png';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    WebkitBrowserPromptRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  box: {
    textAlign: 'center',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 3,
  },
  card: {
    cursor: 'pointer',
    float: 'left',
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: 192,
  },
  clear: {
    clear: 'both',
  },
  browserIcon: {
    height: 64,
    width: 64,
  },
  link: {
    color: theme.palette.primary.dark,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const BrowserPrompt = (props) => {
  const {
    classes,
    onUpdatePreference,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Typography variant="title">
          {STRING_SELECT_BROWSER}
        </Typography>

        <div className={classes.cardContainer}>
          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'juli')}>
            <CardContent>
              <img src={juliIcon} className={classes.browserIcon} alt="Juli" />
              <Typography variant="subheading">
                Juli
              </Typography>
              <Typography variant="body1">
                ({STRING_RECOMMENDED})
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'google-chrome')}>
            <CardContent>
              <img src={chromeIcon} className={classes.browserIcon} alt="Google Chrome" />
              <Typography variant="subheading">
                Google Chrome
              </Typography>
            </CardContent>
          </Card>

          {window.platform !== 'win32' && (
            <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'chromium')}>
              <CardContent>
                <img src={chromiumIcon} className={classes.browserIcon} alt="Chromium" />
                <Typography variant="subheading">
                  Chromium
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'firefox')}>
            <CardContent>
              <img src={firefoxIcon} className={classes.browserIcon} alt="Mozilla Firefox" />
              <Typography variant="subheading">
                Mozilla Firefox
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className={classes.clear} />
   
        <p>
          <span>{STRING_SELECT_BROWSER_DESC_2} </span>
          <span
            onClick={() => requestOpenInBrowser('https://getwebcatalog.com/engines')}
            onKeyDown={() => requestOpenInBrowser('https://getwebcatalog.com/engines')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            {STRING_LEARN_MORE}
          </span>.
        </p>

        <p>{STRING_SELECT_BROWSER_DESC}</p>
      </div>
    </div>
  );
};

BrowserPrompt.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdatePreference: PropTypes.func.isRequired,
};

const actionCreators = {
  updatePreference,
};

export default connectComponent(
  BrowserPrompt,
  null,
  actionCreators,
  styles,
);
