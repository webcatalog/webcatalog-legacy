import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortIcon from '@material-ui/icons/Sort';

import connectComponent from '../../../helpers/connect-component';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';
import { getOutdatedAppsAsList } from '../../../state/app-management/utils';
import { updateAllApps } from '../../../state/app-management/actions';

import {
  requestGetInstalledApps,
  requestSetPreference,
} from '../../../senders';

import StatedMenu from '../../shared/stated-menu';

const styles = (theme) => ({
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
});

const sortOptions = [
  { val: 'name', name: 'Sort by Name (A-Z)' },
  { val: 'name/desc', name: 'Sort by Name (Z-A)' },
  { val: 'last-updated', name: 'Sort by Last Updated' },
];

const Toolbar = ({
  activeQuery,
  classes,
  fetchingLatestTemplateVersion,
  onFetchLatestTemplateVersionAsync,
  onUpdateAllApps,
  outdatedAppCount,
  sortInstalledAppBy,
}) => (
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
            onClick={onUpdateAllApps}
            size="small"
            disabled={outdatedAppCount < 1}
          >
            Update All
          </Button>
        </>
      )}
    </div>
    <div className={classes.right}>
      <StatedMenu
        id="sort-options"
        buttonElement={(
          <Tooltip title="Sort by...">
            <IconButton size="small" aria-label="Sort by...">
              <SortIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      >
        {sortOptions.map((sortOption) => (
          <MenuItem
            key={sortOption.val}
            dense
            onClick={() => requestSetPreference('sortInstalledAppBy', sortOption.val)}
            selected={sortOption.val === sortInstalledAppBy}
          >
            {sortOption.name}
          </MenuItem>
        ))}
      </StatedMenu>
      <StatedMenu
        id="more-options"
        buttonElement={(
          <Tooltip title="More">
            <IconButton size="small" aria-label="More">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      >
        <MenuItem
          dense
          disabled={fetchingLatestTemplateVersion}
          onClick={onFetchLatestTemplateVersionAsync}
        >
          {fetchingLatestTemplateVersion ? 'Checking for Updates...' : 'Check for Updates'}
        </MenuItem>
        <Divider />
        <MenuItem
          dense
          onClick={requestGetInstalledApps}
        >
          Rescan for Installed Apps
        </MenuItem>
      </StatedMenu>
    </div>
  </div>
);

Toolbar.defaultProps = {
  activeQuery: '',
};

Toolbar.propTypes = {
  activeQuery: PropTypes.string,
  classes: PropTypes.object.isRequired,
  fetchingLatestTemplateVersion: PropTypes.bool.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  sortInstalledAppBy: PropTypes.string.isRequired,
};

const actionCreators = {
  fetchLatestTemplateVersionAsync,
  updateAllApps,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  fetchingLatestTemplateVersion: state.general.fetchingLatestTemplateVersion,
  sortInstalledAppBy: state.preferences.sortInstalledAppBy,
  outdatedAppCount: getOutdatedAppsAsList(state).length,
});

export default connectComponent(
  Toolbar,
  mapStateToProps,
  actionCreators,
  styles,
);
