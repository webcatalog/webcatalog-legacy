import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddBoxIcon from 'material-ui-icons/AddBox';
import Divider from 'material-ui/Divider';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import PublicIcon from 'material-ui-icons/Public';
import Menu from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { open as openDialogAbout } from '../../actions/dialogs/about';
import { open as openDialogSubmitApp } from '../../actions/dialogs/submit-app';

class MoreMenuButton extends React.Component {
  constructor() {
    super();

    this.state = {
      anchorEl: undefined,
      open: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOpenDialogAbout = this.handleOpenDialogAbout.bind(this);
    this.handleOpenDialogSubmitApp = this.handleOpenDialogSubmitApp.bind(this);
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

  handleOpenDialogAbout() {
    this.handleRequestClose();
    this.props.onOpenDialogAbout();
  }

  handleOpenDialogSubmitApp() {
    this.handleRequestClose();
    this.props.onOpenDialogSubmitApp();
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
          <ListItem button onClick={this.handleOpenDialogSubmitApp}>
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            <ListItemText primary="Submit app" />
          </ListItem>
          <Divider light />
          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
          <ListItem button onClick={this.handleRequestClose}>
            <ListItemIcon><PublicIcon /></ListItemIcon>
            <ListItemText primary="Website" />
          </ListItem>
          <ListItem button onClick={this.handleOpenDialogAbout}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </Menu>
      </div>
    );
  }
}

MoreMenuButton.defaultProps = {
};

MoreMenuButton.propTypes = {
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  onOpenDialogAbout: () => dispatch(openDialogAbout()),
  onOpenDialogSubmitApp: () => dispatch(openDialogSubmitApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MoreMenuButton);
