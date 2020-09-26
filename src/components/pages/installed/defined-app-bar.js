/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortIcon from '@material-ui/icons/Sort';

import connectComponent from '../../../helpers/connect-component';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';

import {
  requestGetInstalledApps,
  requestSetPreference,
} from '../../../senders';

import StatedMenu from '../../shared/stated-menu';

import SearchBox from './search-box';

const styles = (theme) => ({
  appBar: {
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  toolbar: {
    minHeight: 40,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
  },
  left: {
    width: 200,
  },
  center: {
    flex: 1,
  },
  right: {
    width: 200,
    textAlign: 'right',
  },
});

const sortOptions = [
  { val: 'name', name: 'Sort by Name' },
  { val: 'last-updated', name: 'Sort by Last Updated' },
];

const DefinedAppBar = ({
  classes,
  fetchingLatestTemplateVersion,
  onFetchLatestTemplateVersionAsync,
  sortInstalledAppBy,
}) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar variant="dense" className={classes.toolbar}>
      <div className={classes.left} />
      <div className={classes.center}>
        <SearchBox />
      </div>
      <div className={classes.right}>
        <StatedMenu
          id="sort-options"
          buttonElement={(
            <Tooltip title="Sort by...">
              <IconButton size="small" aria-label="Sort by..." color="inherit">
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
              <IconButton size="small" aria-label="More" color="inherit">
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
    </Toolbar>
  </AppBar>
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchingLatestTemplateVersion: PropTypes.bool.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  sortInstalledAppBy: PropTypes.string.isRequired,
};

const actionCreators = {
  fetchLatestTemplateVersionAsync,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  fetchingLatestTemplateVersion: state.general.fetchingLatestTemplateVersion,
  sortInstalledAppBy: state.preferences.sortInstalledAppBy,
});

export default connectComponent(
  DefinedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
