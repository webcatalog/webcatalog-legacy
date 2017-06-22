import React from 'react';

import Menu, { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

class MoreMenuButton extends React.Component {
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
    return (
      <div>
        <IconButton aria-label="More" color="contrast" onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
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

export default MoreMenuButton;
