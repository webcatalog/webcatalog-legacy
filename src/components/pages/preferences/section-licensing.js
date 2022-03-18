/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

const SectionLicensing = () => {
  const dispatch = useDispatch();
  const registered = useSelector((state) => state.preferences.registered);

  let planName = 'Basic';
  if (registered) planName = 'Lifetime';

  const upgradeToLifetimeComponent = planName === 'Basic' && (
    <>
      <Divider />
      <ListItem button onClick={() => dispatch(openDialogLicenseRegistration())}>
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

export default SectionLicensing;
