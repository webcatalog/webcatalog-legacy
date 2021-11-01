/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

import connectComponent from '../../helpers/connect-component';

import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';

const styles = (theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    WebkitAppRegion: 'no-drag',
  },
});

const CreateButton = ({
  classes,
  onOpenDialogCreateCustomApp,
}) => (
  <Tooltip title="Create Custom App...">
    <IconButton
      size="small"
      color="inherit"
      aria-label="Create Custom App..."
      className={classes.button}
      onClick={() => onOpenDialogCreateCustomApp()}
    >
      <AddIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

CreateButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogCreateCustomApp,
};

export default connectComponent(
  CreateButton,
  null,
  actionCreators,
  styles,
);
