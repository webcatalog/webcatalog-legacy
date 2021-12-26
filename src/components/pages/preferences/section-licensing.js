/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { open as openDialogUpgrade } from '../../../state/dialog-upgrade/actions';

import connectComponent from '../../../helpers/connect-component';

const SectionLicensing = ({
  currentPlan,
  onOpenDialogUpgrade,
  registered,
}) => {
  let planName = 'Basic';
  if (currentPlan === 'pro') planName = 'Pro';
  else if (registered) planName = 'Lifetime';

  return (
    <List dense disablePadding>
      <ListItem button disabled>
        <ListItemText primary={`WebCatalog ${planName}`} />
      </ListItem>
      {planName !== 'Pro' && (
        <>
          <Divider />
          <ListItem button onClick={onOpenDialogUpgrade}>
            <ListItemText
              primary="Upgrade..."
            />
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      )}
    </List>
  );
};

SectionLicensing.defaultProps = {
  currentPlan: 'basic',
  registered: false,
};

SectionLicensing.propTypes = {
  currentPlan: PropTypes.string,
  onOpenDialogUpgrade: PropTypes.func.isRequired,
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentPlan: state.user.publicProfile.currentPlan,
  registered: state.preferences.registered,
});

const actionCreators = {
  openDialogUpgrade,
};

export default connectComponent(
  SectionLicensing,
  mapStateToProps,
  actionCreators,
);
