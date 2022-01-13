/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';

import connectComponent from '../../../helpers/connect-component';

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
});

const UpgradeButton = ({
  classes,
  registered,
  onOpenDialogLicenseRegistration,
}) => {
  if (!registered) {
    return (
      <div className={classes.container}>
        <Button size="small" onClick={() => onOpenDialogLicenseRegistration()} color="inherit">
          Upgrade
        </Button>
      </div>
    );
  }

  return null;
};

UpgradeButton.defaultProps = {
  registered: false,
};

UpgradeButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
  registered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  registered: state.preferences.registered,
});

const actionCreators = {
  openDialogLicenseRegistration,
};

export default connectComponent(
  UpgradeButton,
  mapStateToProps,
  actionCreators,
  styles,
);
