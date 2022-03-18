/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import isUrl from '../../../../helpers/is-url';
import { installApp } from '../../../../state/app-management/actions';
import { close } from '../../../../state/dialog-add-space/actions';
import { open as openDialogCreateCustomApp } from '../../../../state/dialog-create-custom-app/actions';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginTop: theme.spacing(1),
    border: 'none',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  actionButton: {
    minWidth: 'auto',
    marginLeft: theme.spacing(1),
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(1),
    flex: 1,
    overflow: 'hidden',
  },
}));

const AppCard = ({
  description,
  icon,
  icon128,
  id,
  name,
  url,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Paper elevation={0} className={classes.card} square>
      <img
        alt={name}
        className={classes.paperIcon}
        src={icon128 || (isUrl(icon) ? icon : `file://${icon}`)}
      />
      <div className={classes.infoContainer}>
        <Typography variant="subtitle2" className={classes.appName}>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
          {description}
        </Typography>
      </div>
      <div className={classes.actionContainer}>
        <IconButton
          size="small"
          aria-label="More"
          className={classes.topRight}
          onClick={() => {
            const template = [
              {
                label: 'Clone',
                click: () => {
                  dispatch(close());
                  dispatch(openDialogCreateCustomApp({
                    name: `${name} 2`,
                    url,
                    urlDisabled: true,
                    icon,
                  }));
                },
              },
            ];
            const menu = window.remote.Menu.buildFromTemplate(template);
            menu.popup({
              window: window.remote.getCurrentWindow(),
            });
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Button
          className={classes.actionButton}
          color="primary"
          size="small"
          variant="contained"
          disableElevation
          onClick={() => {
            dispatch(installApp(id, name, url, icon));
            dispatch(close());
          }}
        >
          Add
        </Button>
      </div>
    </Paper>
  );
};

AppCard.defaultProps = {
  icon128: null,
};

AppCard.propTypes = {
  icon128: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default AppCard;
