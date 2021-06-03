/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../../helpers/connect-component';
import AppCard from '../../shared/app-card';

// only map app obj to each wrapper
// to avoid re-rendering the whole list (apps changed very often)
const AppCardWrapper = ({ isCustomSpace, id }) => {
  if (!isCustomSpace) return null;
  return (
    <AppCard
      id={id}
    />
  );
};

AppCardWrapper.propTypes = {
  isCustomSpace: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

const LinkedAppCardWrapper = connectComponent(
  AppCardWrapper,
  (state, ownProps) => ({
    isCustomSpace: ownProps.id.startsWith('custom-')
      && state.appManagement.apps[ownProps.id]
      && !state.appManagement.apps[ownProps.id].url,
  }),
);

const InstalledSpaces = ({ sortedAppIds }) => (
  <>
    {sortedAppIds.map((appId) => (
      <LinkedAppCardWrapper
        key={appId}
        id={appId}
      />
    ))}
  </>
);

InstalledSpaces.propTypes = {
  sortedAppIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  sortedAppIds: state.appManagement.sortedAppIds,
});

export default connectComponent(
  InstalledSpaces,
  mapStateToProps,
  null,
  null,
);
