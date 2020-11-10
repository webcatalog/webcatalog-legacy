/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
