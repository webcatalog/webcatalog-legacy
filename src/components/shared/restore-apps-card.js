/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RestoreIcon from '@material-ui/icons/Restore';

import connectComponent from '../../helpers/connect-component';

import { open as openDialogRestore } from '../../state/dialog-restore/actions';

const styles = (theme) => ({
  card: {
    width: 168,
    height: 150,
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1),
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    outline: 'none',
    userSelect: 'none',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  icon: {
    fontSize: '72px',
  },
  desc: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 'normal',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
});

const RestoreAppsCard = ({ classes, onOpenDialogRestore }) => (
  <Grid item>
    <Paper
      className={classes.card}
      elevation={0}
      role="link"
      tabIndex="0"
      onClick={() => onOpenDialogRestore()}
    >
      <RestoreIcon className={classes.icon} />
      <Typography variant="subtitle2" className={classes.desc}>
        Restore Apps
      </Typography>
    </Paper>
  </Grid>
);

RestoreAppsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogRestore: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogRestore,
};

export default connectComponent(
  RestoreAppsCard,
  null,
  actionCreators,
  styles,
);
