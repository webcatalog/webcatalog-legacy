import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import { checkForUpdates } from '../state/root/updater/actions';

import DialogAbout from './dialogs/about';
import DialogPreferences from './dialogs/preferences';

import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import UpdaterMessage from './root/updater-message';
import FormCreateApp from './root/create-app-form';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },
};

class App extends React.Component {
  componentDidMount() {
    const {
      onCheckForUpdates,
    } = this.props;

    onCheckForUpdates();
  }

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        <EnhancedAppBar />
        <UpdaterMessage />
        <EnhancedSnackBar />
        <DialogAbout />
        <DialogPreferences />
        <div style={{ padding: '0 16px' }}>
          <FormCreateApp />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  onCheckForUpdates: PropTypes.func.isRequired,
};

const actionCreators = {
  checkForUpdates,
};

export default connectComponent(
  App,
  null,
  actionCreators,
  styles,
);
