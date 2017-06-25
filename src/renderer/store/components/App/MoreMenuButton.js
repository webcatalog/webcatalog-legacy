import React from 'react';

import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ArrowForwardIcon from 'material-ui-icons/ArrowForward';
import Divider from 'material-ui/Divider';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import Menu from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import SettingsIcon from 'material-ui-icons/Settings';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

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
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <IconButton
          aria-label="More"
          color="contrast"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          open={this.state.open}
        >
          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><ArrowBackIcon /></ListItemIcon>
            <ListItemText primary="Go back" />
          </ListItem>

          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><ArrowForwardIcon /></ListItemIcon>
            <ListItemText primary="Go forward" />
          </ListItem>

          <Divider light />

          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </Menu>
      </div>
    );
  }
}

export default MoreMenuButton;
