/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const UpgradeButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const registered = useSelector((state) => state.preferences.registered);

  if (!registered) {
    return (
      <div className={classes.container}>
        <Button size="small" onClick={() => dispatch(openDialogLicenseRegistration())} color="inherit">
          Upgrade
        </Button>
      </div>
    );
  }

  return null;
};

export default UpgradeButton;
