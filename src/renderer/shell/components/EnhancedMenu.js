import React from 'react';
import PropTypes from 'prop-types';

import Menu, { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';

class EnhancedMenu extends React.Component {
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

  render() {
    const { children } = this.props;

    return (
      <div>
        {React.cloneElement(
          children,
          {
            // 'aria-owns': 'simple-menu',
            'aria-haspopup': true,
            onClick: this.handleClick,
          },
        )}
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleRequestClose}>Go Back</MenuItem>
          <MenuItem onClick={this.handleRequestClose}>Go Forward</MenuItem>
          <Divider light />
          <MenuItem onClick={this.handleRequestClose}>Settings</MenuItem>
          <MenuItem onClick={this.handleRequestClose}>Help</MenuItem>
          <MenuItem onClick={this.handleRequestClose}>About</MenuItem>
        </Menu>
      </div>
    );
  }
}

EnhancedMenu.propTypes = {
  children: PropTypes.element.isRequired,
};

export default EnhancedMenu;
