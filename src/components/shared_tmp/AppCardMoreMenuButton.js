import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { ListItem, ListItemText } from 'material-ui/List';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import { open as openAppDetailsDialog } from '../../state/ui/dialogs/app-details/actions';
import { open as openConfirmUninstallAppDialog } from '../../state/ui/dialogs/confirm-uninstall-app/actions';

const styleSheet = createStyleSheet('MoreMenuButton', {
  iconButton: {
    position: 'absolute',
    transform: 'translate(79px, -17px)',
  },
});

class MoreMenuButton extends React.Component {
  constructor() {
    super();

    this.state = {
      anchorEl: undefined,
      open: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInstall = this.handleInstall.bind(this);
    this.handleOpenApp = this.handleOpenApp.bind(this);
    this.handleOpenAppDetailsDialog = this.handleOpenAppDetailsDialog.bind(this);
    this.handleOpenConfirmUninstallAppDialog = this.handleOpenConfirmUninstallAppDialog.bind(this);
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

  handleOpenAppDetailsDialog() {
    const {
      id,
      name,
    } = this.props;

    this.handleRequestClose();
    this.props.onOpenAppDetailsDialog({ id, name });
  }

  handleInstall() {
    this.handleRequestClose();
  }

  handleOpenConfirmUninstallAppDialog() {
    const { app } = this.props;
    this.handleRequestClose();
    this.props.onOpenConfirmUninstallAppDialog({ app });
  }

  handleOpenApp() {
    const { onOpenApp } = this.props;
    this.handleRequestClose();
    onOpenApp();
  }

  render() {
    const {
      classes,
      isInstalled,
    } = this.props;

    const menuElements = [
      <ListItem
        button
        onClick={this.handleOpenAppDetailsDialog}
      >
        <ListItemText primary="More info" />
      </ListItem>,
    ];

    if (isInstalled) {
      menuElements.push(
        <ListItem
          button
          onClick={this.handleOpenApp}
        >
          <ListItemText primary="Open" />
        </ListItem>,
      );

      menuElements.push(
        <ListItem
          button
          onClick={this.handleOpenConfirmUninstallAppDialog}
        >
          <ListItemText primary="Uninstall" />
        </ListItem>,
      );
    } else {
      menuElements.push(
        <ListItem
          button
          onClick={this.handleInstall}
        >
          <ListItemText primary="Install" />
        </ListItem>,
      );
    }

    return (
      <div>
        <IconButton
          aria-label="More"
          color="default"
          onClick={this.handleClick}
          className={classes.iconButton}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          open={this.state.open}
        >
          {menuElements}
        </Menu>
      </div>
    );
  }
}

MoreMenuButton.defaultProps = {
};

MoreMenuButton.propTypes = {
  app: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isInstalled: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onOpenAppDetailsDialog: PropTypes.func.isRequired,
  onOpenConfirmUninstallAppDialog: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  onOpenAppDetailsDialog: form => dispatch(openAppDetailsDialog(form)),
  onOpenConfirmUninstallAppDialog: form => dispatch(openConfirmUninstallAppDialog(form)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(MoreMenuButton));
