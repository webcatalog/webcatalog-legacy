import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { light } from 'material-ui/styles/palette';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import PaymentIcon from 'material-ui-icons/Payment';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import Slide from 'material-ui/transitions/Slide';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogContentText,
} from 'material-ui/Dialog';

import { close } from '../../../state/ui/dialogs/account/actions';

const styleSheet = createStyleSheet('Account', {
  linearProgress: {
    opacity: 0,
  },
  toolbar: {
    padding: '0 12px',
  },
  dialogTitle: {
    borderBottom: `1px solid ${light.text.divider}`,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  dialogContentText: {
    padding: 24,
    maxWidth: 300,
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${light.text.divider}`,
  },
  flex: {
    flex: 1,
  },
  title: {
    padding: '0 16px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

const Account = (props) => {
  const {
    classes,
    onClose,
    open,
  } = props;

  return (
    <Dialog
      // fullScreen
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <DialogTitle className={classes.dialogTitle}>Account</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <List className={classes.list}>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText primary="Other" />
          </ListItem>
        </List>
        <DialogContentText className={classes.dialogContentText}>
          {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

Account.defaultProps = {
  open: false,
};

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
  } = state.ui.dialogs.account;

  return {
    // open: true,
    open,
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Account));
