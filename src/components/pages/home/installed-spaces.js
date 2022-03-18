/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import AppCard from '../../shared/app-card';

// only map app obj to each wrapper
// to avoid re-rendering the whole list (apps changed very often)
const AppCardWrapper = ({ id }) => {
  const isCustomSpace = useSelector((state) => id.startsWith('custom-')
  && state.appManagement.apps[id]
  && !state.appManagement.apps[id].url);

  if (!isCustomSpace) return null;
  return (
    <AppCard
      id={id}
    />
  );
};

AppCardWrapper.propTypes = {
  id: PropTypes.string.isRequired,
};

const InstalledSpaces = () => {
  const sortedAppIds = useSelector((state) => state.appManagement.sortedAppIds);

  return (
    <>
      {sortedAppIds.map((appId) => (
        <AppCardWrapper
          key={appId}
          id={appId}
        />
      ))}
    </>
  );
};

export default InstalledSpaces;
