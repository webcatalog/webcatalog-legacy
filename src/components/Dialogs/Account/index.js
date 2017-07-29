import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
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
    width: 300,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  textField: {
    width: '100%',
  },
  formFooter: {
    alignSelf: 'flex-end',
    transform: 'translate(16px, 16px)',
  },
});

const Account = (props) => {
  const {
    classes,
    onClose,
    open,
    displayName,
    email,
    profilePicture,
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
          <div>
            <TextField
              className={classes.textField}
              disabled={false}
              id="displayName"
              label="Display Name"
              marginForm
              onChange={() => {}}
              placeholder="e.g. John"
              value={displayName}
            />
            <br />
            <br />
            <TextField
              className={classes.textField}
              disabled={false}
              id="email"
              label="Email"
              marginForm
              onChange={() => {}}
              // placeholder="e.g. john@getwebcatalog.com"
              value={email}
            />
            <br />
            {profilePicture}
          </div>
          <div className={classes.formFooter}>
            <Button
              color="primary"
              onClick={() => {}}
            >
              Save
            </Button>
          </div>
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
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
  } = state.ui.dialogs.account;

  const {
    displayName,
    email,
    profilePicture,
  } = state.user.apiData;

  return {
    // open: true,
    open,
    // displayName,
    displayName: 'John Doe',
    // email,
    email: 'markandrewx@gmail.com',
    profilePicture,
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Account));
