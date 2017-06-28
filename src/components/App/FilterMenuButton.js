import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FilterListIcon from 'material-ui-icons/FilterList';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';

import categories from '../../constants/categories';
import { setCategory } from '../../actions/home';

class FilterMenuButton extends React.Component {
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
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleSetCategory(category) {
    this.setState(
      { open: false },
      () => this.props.onSetCategory(category),
    );
  }

  render() {
    const { category } = this.props;

    const categoryItemElement = categories.map(c => (
      <MenuItem
        key={c.value}
        onClick={() => this.handleSetCategory(c.value)}
        selected={category === c.value}
      >
        {c.label}
      </MenuItem>
    ));

    return (
      <div>
        <IconButton
          aria-label="More"
          color="contrast"
          onClick={this.handleClick}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          open={this.state.open}
        >
          {categoryItemElement}
        </Menu>
      </div>
    );
  }
}

FilterMenuButton.defaultProps = {
  category: null,
};

FilterMenuButton.propTypes = {
  category: PropTypes.string.isRequired,
  onSetCategory: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  category: state.home.category,
});

const mapDispatchToProps = dispatch => ({
  onSetCategory: category => dispatch(setCategory(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterMenuButton);
