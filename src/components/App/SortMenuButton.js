import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import SortIcon from 'material-ui-icons/Sort';

import EnhancedMenu from '../shared/EnhancedMenu';

import {
  setSortBy,
} from '../../actions/home';

const SortMenuButton = (props) => {
  const {
    sortBy,
    sortOrder,
    onSetSortBy,
  } = props;

  const iconButtonColor = sortBy !== 'installCount' ? 'primary' : 'contrast';

  return (
    <EnhancedMenu
      buttonElement={(
        <IconButton aria-label="More" color={iconButtonColor}>
          <SortIcon />
        </IconButton>
      )}
    >
      <MenuItem
        onClick={() => onSetSortBy('installCount', 'desc')}
        selected={sortBy === 'installCount' && sortOrder === 'desc'}
      >
        Most popular
      </MenuItem>
      <MenuItem
        onClick={() => onSetSortBy('installCount', 'asc')}
        selected={sortBy === 'installCount' && sortOrder === 'asc'}
      >
        Least popular
      </MenuItem>
      <MenuItem
        onClick={() => onSetSortBy('name', 'asc')}
        selected={sortBy === 'name' && sortOrder === 'asc'}
      >
        Name (A-Z)
      </MenuItem>
      <MenuItem
        onClick={() => onSetSortBy('name', 'desc')}
        selected={sortBy === 'name' && sortOrder === 'desc'}
      >
        Name (Z-A)
      </MenuItem>
      <MenuItem
        onClick={() => onSetSortBy('createdAt', 'desc')}
        selected={sortBy === 'createdAt' && sortOrder === 'desc'}
      >
        Most recently added
      </MenuItem>
    </EnhancedMenu>
  );
};

SortMenuButton.defaultProps = {
  sortBy: null,
  sortOrder: null,
};

SortMenuButton.propTypes = {
  onSetSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
};

const mapStateToProps = state => ({
  sortBy: state.home.sortBy,
  sortOrder: state.home.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  onSetSortBy: (sortBy, sortOrder) => dispatch(setSortBy(sortBy, sortOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortMenuButton);
