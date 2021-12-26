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
import { getCurrentPlan } from '../../../state/user/utils';

import connectComponent from '../../../helpers/connect-component';

const SectionLicensing = ({
  currentPlan,
  onOpenDialogUpgrade,
}) => {
  let planName = 'Basic';
  if (currentPlan === 'pro') planName = 'Pro';
  else if (currentPlan === 'lifetime') planName = 'Lifetime';

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

SectionLicensing.propTypes = {
  currentPlan: PropTypes.string.isRequired,
  onOpenDialogUpgrade: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentPlan: getCurrentPlan(state),
});

const actionCreators = {
  openDialogUpgrade,
};

export default connectComponent(
  SectionLicensing,
  mapStateToProps,
  actionCreators,
);
