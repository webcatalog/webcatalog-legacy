/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../../helpers/connect-component';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';
import CreateButton from '../../shared/create-button';

const styles = () => ({
  centerContainer: {
    display: 'flex',
    maxWidth: 480,
    margin: '0 auto',
  },
});

const DefinedAppBar = ({
  classes,
}) => (
  <EnhancedAppBar
    center={(
      <div className={classes.centerContainer}>
        <SearchBox />
        <CreateButton />
      </div>
    )}
  />
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  DefinedAppBar,
  null,
  null,
  styles,
);
