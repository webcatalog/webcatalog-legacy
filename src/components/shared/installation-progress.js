/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: 28,
  },
  top: {
    color: theme.palette.primary.main,
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 2,
  },
  bottom: {
    color: theme.palette.primary.main,
    opacity: 0.2,
    // animationDuration: '550ms',
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 1,
  },
  tooltip: {
    maxWidth: 400,
  },
}));

const AppCard = ({
  defaultDesc,
}) => {
  const classes = useStyles();

  const progressPercent = useSelector((state) => state.general.installationProgress.percent);
  const progressDesc = useSelector((state) => state.general.installationProgress.desc);

  return (
    <div className={classes.root}>
      <Tooltip
        title={progressDesc || defaultDesc}
        aria-label={progressDesc || defaultDesc}
        placement="right"
        classes={{
          tooltip: classes.tooltip,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progressPercent}
          className={classes.top}
          size={28}
          thickness={4}
        />
      </Tooltip>
      <CircularProgress
        variant="determinate"
        value={100}
        className={classes.bottom}
        size={28}
        thickness={4}
      />
    </div>
  );
};

AppCard.propTypes = {
  defaultDesc: PropTypes.string.isRequired,
};

export default AppCard;
