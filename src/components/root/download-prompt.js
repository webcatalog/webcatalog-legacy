import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders/generic';

import { updateBrowserInstalled } from '../../state/root/general/actions';
import { updatePreference } from '../../state/root/preferences/actions';

import {
  STRING_TO_CONTINUE_INSTALL_BROWSER,
  STRING_DOWNLOAD_BROWSER,
  STRING_CONTINUE,
  STRING_CHANGE_BROWSER,
} from '../../constants/strings';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    WebkitDownloadPromptRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  box: {
    textAlign: 'center',
  },
  continueButton: {
    marginLeft: theme.spacing.unit,
  },
  changeBrowser: {
    marginTop: theme.spacing.unit * 2,
  },
});

const DownloadPrompt = (props) => {
  const {
    browser,
    classes,
    onUpdateBrowserInstalled,
    onUpdatePreference,
  } = props;

  let browserName = 'Google Chrome';
  if (browser === 'chromium') browserName = 'Chromium';

  let downloadUrl = 'https://www.google.com/chrome/';
  if (browser === 'chromium') downloadUrl = 'https://www.chromium.org/getting-involved/download-chromium';

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <p>{STRING_TO_CONTINUE_INSTALL_BROWSER.replace('{1}', browserName)}</p>

        <p>
          <Button
            variant="raised"
            color="primary"
            onClick={() => requestOpenInBrowser(downloadUrl)}
          >
            {STRING_DOWNLOAD_BROWSER.replace('{1}', browserName)}
          </Button>
          <Button
            variant="raised"
            className={classes.continueButton}
            onClick={onUpdateBrowserInstalled}
          >
            {STRING_CONTINUE}
          </Button>
        </p>

        <Button
          className={classes.changeBrowser}
          onClick={() => onUpdatePreference('browser', null)}
        >
          {STRING_CHANGE_BROWSER}
        </Button>
      </div>
    </div>
  );
};

DownloadPrompt.defaultProps = {
  browser: 'google-chrome',
};

DownloadPrompt.propTypes = {
  browser: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onUpdateBrowserInstalled: PropTypes.func.isRequired,
  onUpdatePreference: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  browser: state.preferences.browser,
});


const actionCreators = {
  updateBrowserInstalled,
  updatePreference,
};

export default connectComponent(
  DownloadPrompt,
  mapStateToProps,
  actionCreators,
  styles,
);
