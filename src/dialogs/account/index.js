import React from 'react';
import PropTypes from 'prop-types';

import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import List, { ListItemIcon, ListItemText } from 'material-ui/List';
import LockIcon from 'material-ui-icons/Lock';
import { light } from 'material-ui/styles/palette';
import { MenuItem } from 'material-ui/Menu';

import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Dialog, {
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import grey from 'material-ui/colors/grey';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  sectionChange,
} from '../../state/dialogs/account/actions';

import { SECTIONS } from '../../state/dialogs/account/constants';

import { isSectionActive as isSectionActiveSelector }
  from '../../state/dialogs/account/utils';

import {
  STRING_ACCOUNT,
  STRING_PASSWORD,
  STRING_PROFILE,
} from '../../constants/strings';

import EnhancedDialogTitle from '../../shared/enhanced-dialog-title';

import Profile from './profile';
import Password from './password';

const styles = {
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
    display: 'flex',
    flexDirection: 'column',
    height: 320,
    justifyContent: 'space-between',
    padding: 24,
    width: 320,
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  list: {
    borderRight: `1px solid ${light.text.divider}`,
    display: 'flex',
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
  },
  title: {
    flex: 1,
    overflow: 'hidden',
    padding: '0 16px',
    textOverflow: 'ellipsis',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  textField: {
    width: '100%',
  },
  formFooter: {
    alignSelf: 'flex-end',
    transform: 'translate(16px, 16px)',
  },
  menuItem: {
    '&:hover': {
      background: grey[300],
    },
  },
  menuItemSelected: {
    extend: 'menuItem',
    '&:hover': {
      background: grey[400],
    },
  },
};

const Account = (props) => {
  const {
    classes,
    isPasswordActive,
    isProfileActive,
    onClose,
    onSectionChange,
    open,
  } = props;

  let contentElement;
  if (isProfileActive) contentElement = <Profile />;
  else contentElement = <Password />;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ACCOUNT}
      </EnhancedDialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <List className={classes.list}>
          <MenuItem
            button
            className={classes[`${isProfileActive ? 'menuItemSelected' : 'menuItem'}`]}
            onClick={() => onSectionChange(SECTIONS.PROFILE)}
            selected={isProfileActive}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={STRING_PROFILE} />
          </MenuItem>
          <MenuItem
            button
            className={classes[`${isPasswordActive ? 'menuItemSelected' : 'menuItem'}`]}
            onClick={() => onSectionChange(SECTIONS.PASSWORD)}
            selected={isPasswordActive}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary={STRING_PASSWORD} />
          </MenuItem>
        </List>
        <DialogContentText className={classes.dialogContentText}>
          {contentElement}
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
  isPasswordActive: PropTypes.bool.isRequired,
  isProfileActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { open } = state.dialogs.account;
  return {
    isPasswordActive: isSectionActiveSelector(state, SECTIONS.PASSWORD),
    isProfileActive: isSectionActiveSelector(state, SECTIONS.PROFILE),
    open,
  };
};

const actionCreators = {
  close,
  sectionChange,
};

export default connectComponent(
  Account,
  mapStateToProps,
  actionCreators,
  styles,
);
