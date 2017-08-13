import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FilterListIcon from 'material-ui-icons/FilterList';
import IconButton from 'material-ui/IconButton';
import { MenuItem } from 'material-ui/Menu';
import EnhancedMenu from '../../shared/EnhancedMenu';

import categories from '../../../constants/categories';
import { setCategory } from '../../../state/topCharts/actions';

const FilterMenuButton = (props) => {
  const {
    category,
    onSetCategory,
  } = props;

  const categoryItemElements = categories.map(c => (
    <MenuItem
      key={c.value}
      onClick={() => onSetCategory(c.value)}
      selected={category === c.value}
    >
      {c.label}
    </MenuItem>
  ));


  return (
    <EnhancedMenu
      id="filterMenuButton"
      buttonElement={(
        <IconButton
          aria-label="Filter"
        >
          <FilterListIcon />
        </IconButton>
      )}
    >
      {categoryItemElements}
    </EnhancedMenu>
  );
};

FilterMenuButton.defaultProps = {
  category: null,
};

FilterMenuButton.propTypes = {
  category: PropTypes.string,
  onSetCategory: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  category: state.topCharts.queryParams.category,
});

const mapDispatchToProps = dispatch => ({
  onSetCategory: category => dispatch(setCategory(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterMenuButton);
