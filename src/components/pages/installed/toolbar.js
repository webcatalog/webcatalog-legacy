/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import RefreshIcon from '@material-ui/icons/Refresh';
import SortIcon from '@material-ui/icons/Sort';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';
import { getOutdatedAppsAsList } from '../../../state/app-management/utils';
import { updateAllApps } from '../../../state/app-management/actions';

import {
  requestGetInstalledApps,
  requestSetPreference,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statusText: {
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  betaSwitchLabelRoot: {
    marginLeft: 0,
  },
  betaSwitchLabelLabel: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    userSelect: 'none',
  },
}));

const Toolbar = () => {
  const activeQuery = useSelector((state) => state.installed.activeQuery);
  const allowPrerelease = useSelector((state) => state.preferences.allowPrerelease);
  const fetchingLatestTemplateVersion = useSelector(
    (state) => state.general.fetchingLatestTemplateVersion,
  );
  const outdatedAppCount = useSelector((state) => getOutdatedAppsAsList(state).length);
  const sortInstalledAppBy = useSelector((state) => state.preferences.sortInstalledAppBy);

  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        {activeQuery.length > 0 ? (
          <Typography variant="body2" color="textSecondary" className={classes.statusText}>
            Search results for
            &quot;
            {activeQuery}
            &quot;
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="textSecondary" className={classes.statusText}>
              <span>{outdatedAppCount}</span>
              <span>&nbsp;Pending Updates</span>
            </Typography>
            <Button
              onClick={() => dispatch(updateAllApps())}
              size="small"
              disabled={outdatedAppCount < 1}
            >
              Update All
            </Button>
          </>
        )}
      </div>
      <div className={classes.right}>
        <FormControlLabel
          control={(
            <Switch
              checked={allowPrerelease}
              onChange={(e) => {
                requestSetPreference('allowPrerelease', e.target.checked);
                dispatch(fetchLatestTemplateVersionAsync());
              }}
              size="small"
              disabled={fetchingLatestTemplateVersion}
            />
          )}
          label="Receive beta updates"
          classes={{
            root: classes.betaSwitchLabelRoot,
            label: classes.betaSwitchLabelLabel,
          }}
        />
        <Tooltip title="Sort by...">
          <IconButton
            size="small"
            aria-label="Sort by..."
            onClick={() => {
              const sortOptions = [
                { val: 'name', name: 'Sort by Name (A-Z)' },
                { val: 'name/desc', name: 'Sort by Name (Z-A)' },
                { val: 'last-updated', name: 'Sort by Last Updated' },
              ];

              const template = sortOptions.map((sortOption) => ({
                type: 'checkbox',
                label: sortOption.name,
                click: () => requestSetPreference('sortInstalledAppBy', sortOption.val),
                checked: sortOption.val === sortInstalledAppBy,
              }));
              const menu = window.remote.Menu.buildFromTemplate(template);
              menu.popup(window.remote.getCurrentWindow());
            }}
          >
            <SortIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            aria-label="Refresh"
            onClick={() => {
              dispatch(fetchLatestTemplateVersionAsync());
              requestGetInstalledApps();
            }}
            disabled={fetchingLatestTemplateVersion}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Toolbar;
