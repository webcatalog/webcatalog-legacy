/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';

import EnhancedAppBar from '../../shared/enhanced-app-bar';

const styles = () => ({
  title: {
    textAlign: 'center',
    color: 'inherit',
    fontWeight: 400,
  },
});

const DefinedAppBar = ({
  classes,
}) => (
  <EnhancedAppBar
    center={(
      <Typography variant="body1" className={classes.title}>
        Categories
      </Typography>
    )}
  />
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
