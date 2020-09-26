/* eslint-disable no-constant-condition */
import React from 'react';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';

const DefinedAppBar = () => (
  <EnhancedAppBar
    center={<SearchBox />}
  />
);

export default DefinedAppBar;
