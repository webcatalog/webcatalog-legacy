import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

import {
  STRING_SELECT_BROWSER,
  STRING_SELECT_BROWSER_DESC,
} from '../../constants/strings';

import { updatePreference } from '../../state/root/preferences/actions';

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
});

const BrowserPrompt = (props) => {
  const {
    classes,
    onUpdatePreference,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <p>{STRING_SELECT_BROWSER}</p>

        <div className={classes.cardContainer}>
        
          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'juli')}>
            <CardContent>
              <img src={juliIcon} className={classes.browserIcon} alt="Juli" />
              <Typography variant="subheading">
                Juli
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
