import React from 'react';
import PropTypes from 'prop-types';

import { WithSearch } from '@elastic/react-search-ui';

import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SortIcon from '@material-ui/icons/Sort';
import RefreshIcon from '@material-ui/icons/Refresh';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogReferral } from '../../../state/dialog-referral/actions';

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
});

const Toolbar = ({
  classes,
  onOpenDialogReferral,
}) => (
  <WithSearch
    mapContextToProps={({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
      searchTerm,
      setSearchTerm,
    }) => ({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
      searchTerm,
      setSearchTerm,
    })}
  >
    {({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
      searchTerm,
      setSearchTerm,
    }) => (
      <div className={classes.root}>
        <div className={classes.left}>
          {isLoading && results.length > 0 && (
            <Typography variant="body2" color="textSecondary" className={classes.statusText}>
              Loading...
            </Typography>
          )}
        </div>
        <div className={classes.right}>
          <Button variant="text" onClick={onOpenDialogReferral}>
            Share your Love
          </Button>
          <Tooltip title="Refresh">
            <IconButton
              size="small"
              aria-label="Refresh"
              onClick={() => {
                // clear cache first
                if (window.elasticAppSearchQueryCache) {
                  window.elasticAppSearchQueryCache.clear();
                }
                setSearchTerm(searchTerm, { refresh: true, debounce: 0 });
              }}
              disabled={isLoading}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
            {[
              { name: 'Sort by Relevance', sortField: '', sortDirection: '' },
              { name: 'Sort by Name (A-Z)', sortField: 'name', sortDirection: 'asc' },
              { name: 'Sort by Name (Z-A)', sortField: 'name', sortDirection: 'desc' },
              { name: 'Sort by Date Added', sortField: 'date_added', sortDirection: 'desc' },
            ].map((sortOption) => (
              <MenuItem
                key={sortOption.name}
                dense
                onClick={() => setSort(sortOption.sortField, sortOption.sortDirection)}
                selected={sortOption.sortField === sortField
                  && sortOption.sortDirection === sortDirection}
              >
                {sortOption.name}
              </MenuItem>
            ))}
          </StatedMenu>
        </div>
      </div>
    )}
  </WithSearch>
);

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogReferral: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogReferral,
};

export default connectComponent(
  Toolbar,
  null,
  actionCreators,
  styles,
);
