import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders/generic';

import { updateChromeInstalled } from '../../state/root/router/actions';

import {
  STRING_TO_CONTINUE_INSTALL_CHROME,
  STRING_DOWNLOAD_CHROME,
  STRING_CONTINUE,
} from '../../constants/strings';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
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
});

const App = (props) => {
  const {
    classes,
    onUpdateChromeInstalled,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <p>{STRING_TO_CONTINUE_INSTALL_CHROME}</p>

        <p>
          <Button variant="raised" color="primary" onClick={() => requestOpenInBrowser('https://www.google.com/chrome/')}>
            {STRING_DOWNLOAD_CHROME}
          </Button>
          <Button
            variant="raised"
            className={classes.continueButton}
            onClick={onUpdateChromeInstalled}
          >
            {STRING_CONTINUE}
          </Button>
        </p>
      </div>
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateChromeInstalled: PropTypes.func.isRequired,
};

const actionCreators = {
  updateChromeInstalled,
};

export default connectComponent(
  App,
  null,
  actionCreators,
  styles,
);
