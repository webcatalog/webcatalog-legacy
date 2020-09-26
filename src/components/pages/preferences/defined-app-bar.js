/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';

const styles = (theme) => ({
  appBar: {
    appRegion: 'drag',
    userSelect: 'none',
  },
  toolbar: {
    minHeight: 40,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'inherit',
    fontWeight: 400,
  },
});

const DefinedAppBar = ({
  classes,
}) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar variant="dense" className={classes.toolbar}>
      <Typography variant="body1" className={classes.title}>
        Preferences
      </Typography>
    </Toolbar>
  </AppBar>
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const actionCreators = {
  fetchLatestTemplateVersionAsync,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  fetchingLatestTemplateVersion: state.general.fetchingLatestTemplateVersion,
  sortInstalledAppBy: state.preferences.sortInstalledAppBy,
});

export default connectComponent(
  DefinedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
