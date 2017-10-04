import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';

import connectComponent from '../helpers/connect-component';

import { close } from '../state/dialogs/update-main-app-first/actions';
import { open as openAboutDialog } from '../state/dialogs/about/actions';
import {
  STRING_UPDATE_WEBCATALOG_FIRST,
  STRING_UPDATE_WEBCATALOG_FIRST_DESC,
  STRING_OPEN_ABOUT_DIALOG,
  STRING_CLOSE,
} from '../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = {};

const UpdateWebCatalogFirstDialog = (props) => {
  const {
    classes,
    onClose,
    onOpenAboutDialog,
    open,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_UPDATE_WEBCATALOG_FIRST}
      </EnhancedDialogTitle>
      <DialogContent>
        <DialogContentText>
          {STRING_UPDATE_WEBCATALOG_FIRST_DESC}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            onClose();
            onOpenAboutDialog();
          }}
        >
          {STRING_OPEN_ABOUT_DIALOG}
        </Button>
        <Button onClick={onClose} color="primary">
          {STRING_CLOSE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateWebCatalogFirstDialog.defaultProps = {
  updaterData: {},
};

UpdateWebCatalogFirstDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenAboutDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.updateMainAppFirst.open,
});

const actionCreators = {
  close,
  openAboutDialog,
};

export default connectComponent(
  UpdateWebCatalogFirstDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
