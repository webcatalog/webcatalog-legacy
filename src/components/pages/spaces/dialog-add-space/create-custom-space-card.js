/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { open as openDialogCreateCustomApp } from '../../../../state/dialog-create-custom-app/actions';
import { close as closeDialogAddSpace } from '../../../../state/dialog-add-space/actions';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1.5),
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    border: 'none',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.selected,
    },
    textAlign: 'left',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    fontSize: '64px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flex: 1,
  },
}));

const SubmitAppCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Grid item xs={12}>
      <Paper
        elevation={0}
        className={classes.card}
        onClick={() => {
          dispatch(closeDialogAddSpace());
          dispatch(openDialogCreateCustomApp({ urlDisabled: true }));
        }}
      >
        <div>
          <AddCircleIcon className={classes.paperIcon} />
        </div>
        <div className={classes.infoContainer}>
          <Typography variant="subtitle1" className={classes.appName}>
            Create Custom Space
          </Typography>
          <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
            Create custom space with your preferred name and icon.
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
};

export default SubmitAppCard;
