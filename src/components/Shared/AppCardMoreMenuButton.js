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
    transform: 'translate(57px, -17px)',
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
      name,
      url,
    } = this.props;

    this.handleRequestClose();
    this.props.onOpenAppDetailsDialog({ name, url });
  }

  handleOpenConfirmUninstallAppDialog() {
    const { name } = this.props;
    this.handleRequestClose();
    this.props.onOpenConfirmUninstallAppDialog({ appName: name });
  }

  render() {
    const { classes } = this.props;

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
          <ListItem button onClick={this.handleOpenAppDetailsDialog}>
            <ListItemText primary="More info" />
          </ListItem>
          <ListItem button onClick={this.handleOpenConfirmUninstallAppDialog}>
            <ListItemText primary="Uninstall" />
          </ListItem>
        </Menu>
      </div>
    );
  }
}

MoreMenuButton.defaultProps = {
};

MoreMenuButton.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onOpenAppDetailsDialog: PropTypes.func.isRequired,
  onOpenConfirmUninstallAppDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  name: ownProps.app.name,
  url: ownProps.app.url,
});

const mapDispatchToProps = dispatch => ({
  onOpenAppDetailsDialog: form => dispatch(openAppDetailsDialog(form)),
  onOpenConfirmUninstallAppDialog: form => dispatch(openConfirmUninstallAppDialog(form)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(MoreMenuButton));
