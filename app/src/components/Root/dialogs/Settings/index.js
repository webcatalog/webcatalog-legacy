import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { light } from 'material-ui/styles/palette';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import LockIcon from 'material-ui-icons/Lock';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItemIcon, ListItemText } from 'material-ui/List';

import Divider from 'material-ui/Divider';
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

import { grey } from 'material-ui/styles/colors';
import {
  close,
  sectionChange,
} from '../../../../state/dialogs/settings/actions';

import { SECTIONS } from '../../../../state/dialogs/settings/constants';
import { isSectionActive as isSectionActiveSelector }
  from '../../../../state/dialogs/settings/utils';

import Basic from './basic';
import Advanced from './advanced';

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
    width: 384,
    height: 592,
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
});

const Account = (props) => {
  const {
    classes,
    onClose,
    open,
    onSectionChange,
    isBasicActive,
    isAdvancedActive,
  } = props;

  let contentElement;
  if (isBasicActive) contentElement = <Basic />;
  else contentElement = <Advanced />;

  return (
    <Dialog
      // fullScreen
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <DialogTitle>App settings</DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <List className={classes.list}>
          <MenuItem
            selected={isBasicActive}
            button
            onClick={() => onSectionChange(SECTIONS.BASIC)}
            className={classes[`${isBasicActive ? 'menuItemSelected' : 'menuItem'}`]}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Basic" />
          </MenuItem>
          <MenuItem
            selected={isAdvancedActive}
            button
            onClick={() => onSectionChange(SECTIONS.ADVANCED)}
            className={classes[`${isAdvancedActive ? 'menuItemSelected' : 'menuItem'}`]}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Advanced" />
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
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  isBasicActive: PropTypes.bool.isRequired,
  isAdvancedActive: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { open } = state.dialogs.settings;

  return {
    // open: true,
    open,
    isBasicActive: isSectionActiveSelector(state, SECTIONS.BASIC),
    isAdvancedActive: isSectionActiveSelector(state, SECTIONS.ADVANCED),
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onSectionChange: section => dispatch(sectionChange(section)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Account));
