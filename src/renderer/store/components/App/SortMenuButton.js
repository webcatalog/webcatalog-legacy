import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import SortIcon from 'material-ui-icons/Sort';

import {
  setSortBy,
} from '../../actions/home';

class SortMenuButton extends React.Component {
  constructor() {
    super();

    this.state = {
      anchorEl: undefined,
      open: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(e) {
    this.setState({ open: true, anchorEl: e.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleSetSortBy(sortBy, sortOrder) {
    this.setState({ open: false }, () => this.props.onSetSortBy(sortBy, sortOrder));
  }

  render() {
    const {
      sortBy,
      sortOrder,
    } = this.props;

    return (
      <div>
        <IconButton aria-label="More" color="contrast" onClick={this.handleClick}>
          <SortIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <MenuItem
            onClick={() => this.handleSetSortBy('installCount', 'desc')}
            selected={sortBy === 'installCount' && sortOrder === 'desc'}
          >
            Most popular
          </MenuItem>
          <MenuItem
            onClick={() => this.handleSetSortBy('installCount', 'asc')}
            selected={sortBy === 'installCount' && sortOrder === 'asc'}
          >
            Least popular
          </MenuItem>
          <MenuItem
            onClick={() => this.handleSetSortBy('name', 'asc')}
            selected={sortBy === 'name' && sortOrder === 'asc'}
          >
            Name (A-Z)
          </MenuItem>
          <MenuItem
            onClick={() => this.handleSetSortBy('name', 'desc')}
            selected={sortBy === 'name' && sortOrder === 'desc'}
          >
            Name (Z-A)
          </MenuItem>
          <MenuItem
            onClick={() => this.handleSetSortBy('createdAt', 'desc')}
            selected={sortBy === 'createdAt' && sortOrder === 'desc'}
          >
            Most recently added
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

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
  // status: state.home.status,
  // apps: state.home.apps,
  // category: state.home.category,
  sortBy: state.home.sortBy,
  sortOrder: state.home.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  // onFetchApps: () => dispatch(fetchApps()),
  // onSetCategory: category => dispatch(setCategory(category)),
  onSetSortBy: (sortBy, sortOrder) => dispatch(setSortBy(sortBy, sortOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortMenuButton);

// onClick={() => requestSetSort('installCount')}
// />
// <MenuItem
// text="Name"
// onClick={() => requestSetSort('name')}
// />
// <MenuItem
// text="Recently Added"
// onClick={() => requestSetSort('createdAt')}
