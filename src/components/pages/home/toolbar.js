import React from 'react';
import PropTypes from 'prop-types';

import { WithSearch } from '@elastic/react-search-ui';

import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import SortIcon from '@material-ui/icons/Sort';

import connectComponent from '../../../helpers/connect-component';

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
}) => (
  <WithSearch
    mapContextToProps={({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
    }) => ({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
    })}
  >
    {({
      isLoading,
      results,
      setSort,
      sortDirection,
      sortField,
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
};

export default connectComponent(
  Toolbar,
  null,
  null,
  styles,
);
