import React from 'react';
import PropTypes from 'prop-types';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import connectComponent from '../../helpers/connect-component';

import {
  STRING_SELECT_BROWSER,
  STRING_SELECT_BROWSER_DESC,
  STRING_SHARE_DATA_BETWEEN_APPS,
} from '../../constants/strings';

import { updatePreference } from '../../state/root/preferences/actions';

import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';

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
  },
  card: {
    cursor: 'pointer',
    float: 'left',
    marginLeft: theme.spacing.unit,
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
    shareData,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <p>{STRING_SELECT_BROWSER}</p>

        <div className={classes.cardContainer}>
          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'google-chrome')}>
            <CardContent>
              <img src={chromeIcon} className={classes.browserIcon} alt="Google Chrome" />
              <Typography variant="subheading">
                Google Chrome
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.card} onClick={() => onUpdatePreference('browser', 'chromium')}>
            <CardContent>
              <img src={chromiumIcon} className={classes.browserIcon} alt="Chromium" />
              <Typography variant="subheading">
                Chromium
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className={classes.clear} />

        <FormControlLabel
          control={
            <Checkbox
              checked={shareData}
              onChange={e => onUpdatePreference('shareData', e.target.checked)}
              color="primary"
            />
          }
          label={STRING_SHARE_DATA_BETWEEN_APPS}
        />

        <p>{STRING_SELECT_BROWSER_DESC}</p>
      </div>
    </div>
  );
};

BrowserPrompt.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdatePreference: PropTypes.func.isRequired,
  shareData: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  shareData: state.preferences.shareData,
});

const actionCreators = {
  updatePreference,
};

export default connectComponent(
  BrowserPrompt,
  mapStateToProps,
  actionCreators,
  styles,
);
