/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { WithSearch } from '@elastic/react-search-ui';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import SortIcon from '@material-ui/icons/Sort';
import RefreshIcon from '@material-ui/icons/Refresh';

import connectComponent from '../../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
}) => (
  <WithSearch
    mapContextToProps={({
      error,
      filters,
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
      searchTerm,
      setSearchTerm,
    }) => ({
      error,
      filters,
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
      error,
      filters,
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
      searchTerm,
      setSearchTerm,
    }) => {
      const categoryFilter = filters.find((filter) => filter.field === 'category');
      const typeFilter = filters.find((filter) => filter.field === 'type');

      return (
        <div className={classes.root}>
          <div className={classes.left}>
            {isLoading && results.length > 0 && (
              <Typography variant="body2" color="textSecondary" className={classes.statusText}>
                Loading...
              </Typography>
            )}
            {!isLoading && categoryFilter != null && (
              <Typography variant="body2" color="textSecondary" className={classes.statusText}>
                {categoryFilter.values[0]}
              </Typography>
            )}
            {!isLoading && categoryFilter == null && typeFilter && typeFilter.values[0] === 'Multisite' && (
              <Typography variant="body2" color="textSecondary" className={classes.statusText}>
                Spaces let you organize multiple services & accounts in one place.
              </Typography>
            )}
          </div>
          <div className={classes.right}>
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
                disabled={isLoading && !error}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort by...">
              <IconButton
                size="small"
                aria-label="Sort by..."
                // // when searching, results are ALWAYS sorted by relevance
                disabled={searchTerm.length > 0}
                onClick={() => {
                  const template = [
                    { name: 'Sort by Relevance', sortField: '', sortDirection: '' },
                    { name: 'Sort by Name (A-Z)', sortField: 'name', sortDirection: 'asc' },
                    { name: 'Sort by Name (Z-A)', sortField: 'name', sortDirection: 'desc' },
                    { name: 'Sort by Date Added', sortField: 'date_added', sortDirection: 'desc' },
                  ].map((sortOption) => ({
                    type: 'checkbox',
                    label: sortOption.name,
                    click: () => setSort(sortOption.sortField, sortOption.sortDirection),
                    checked: sortOption.sortField === sortField
                      && sortOption.sortDirection === sortDirection,
                  }));

                  const menu = window.remote.Menu.buildFromTemplate(template);
                  menu.popup(window.remote.getCurrentWindow());
                }}
              >
                <SortIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    }}
  </WithSearch>
);

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Toolbar,
  null,
  null,
  styles,
);
