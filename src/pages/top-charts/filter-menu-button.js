import React from 'react';

import PropTypes from 'prop-types';

import FilterListIcon from 'material-ui-icons/FilterList';
import IconButton from 'material-ui/IconButton';
import { MenuItem } from 'material-ui/Menu';

import connectComponent from '../../utils/connect-component';

import EnhancedMenu from '../../shared/enhanced-menu';

import categories from '../../constants/categories';
import { setCategory } from '../../state/pages/top-charts/actions';

import { STRING_FILTER } from '../../constants/strings';

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
          aria-label={STRING_FILTER}
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
  category: state.pages.topCharts.queryParams.category,
});

const actionCreators = {
  setCategory,
};

export default connectComponent(
  FilterMenuButton,
  mapStateToProps,
  actionCreators,
);
