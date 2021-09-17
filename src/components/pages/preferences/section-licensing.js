/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

import connectComponent from '../../../helpers/connect-component';

const SectionLicensing = ({
  currentPlan,
  registered,
  onOpenDialogLicenseRegistration,
}) => {
  let planName = 'Basic';
  if (currentPlan === 'pro') planName = 'Pro';
  else if (registered) planName = 'Lifetime';

  const upgradeToLifetimeComponent = planName === 'Basic' && (
    <>
      <Divider />
      <ListItem button onClick={onOpenDialogLicenseRegistration}>
        <ListItemText
          primary="Upgrade to WebCatalog Lifetime"
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    </>
  );

  return (
    <List dense disablePadding>
      <ListItem button disabled>
        <ListItemText primary={`WebCatalog ${planName}`} />
      </ListItem>
      {upgradeToLifetimeComponent}
    </List>
  );
};

SectionLicensing.defaultProps = {
  currentPlan: 'basic',
  registered: false,
};

SectionLicensing.propTypes = {
  currentPlan: PropTypes.string,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentPlan: state.user.publicProfile.currentPlan,
  displayName: state.user.displayName,
  isSignedIn: state.user.isSignedIn,
  photoURL: state.user.photoURL,
  registered: state.preferences.registered,
});

const actionCreators = {
  openDialogLicenseRegistration,
};

export default connectComponent(
  SectionLicensing,
  mapStateToProps,
  actionCreators,
);
