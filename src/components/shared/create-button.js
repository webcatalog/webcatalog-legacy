/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    WebkitAppRegion: 'no-drag',
  },
}));

const CreateButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Tooltip title="Create Custom App...">
      <IconButton
        size="small"
        color="inherit"
        aria-label="Create Custom App..."
        className={classes.button}
        onClick={() => dispatch(openDialogCreateCustomApp())}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default CreateButton;
