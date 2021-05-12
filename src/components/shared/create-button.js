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

import { requestOpenInBrowser } from '../../senders';

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
  <Tooltip title="Create...">
    <IconButton
      size="small"
      color="inherit"
      aria-label="Create..."
      className={classes.button}
      onClick={() => {
        const template = [
          {
            label: 'Create Custom App',
            click: () => {
              onOpenDialogCreateCustomApp();
            },
          },
          {
            label: 'Create Custom Space',
            click: () => {
              onOpenDialogCreateCustomApp({ urlDisabled: true });
            },
          },
          { type: 'separator' },
          {
            label: 'Submit New App to the Catalog',
            click: () => {
              requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9');
            },
          },
        ];

        const menu = window.remote.Menu.buildFromTemplate(template);
        menu.popup(window.remote.getCurrentWindow());
      }}
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
