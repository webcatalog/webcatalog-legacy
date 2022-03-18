/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { dialog, getCurrentWindow } from '@electron/remote';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import {
  close,
  save,
  updateForm,
} from '../../state/dialog-set-installation-path/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyles = makeStyles((theme) => ({
  top: {
    marginTop: theme.spacing(1),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
}));

const DialogSetInstallationPath = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogSetInstallationPath.open);
  const installationPath = useSelector(
    (state) => state.dialogSetInstallationPath.form.installationPath || '~/Applications/WebCatalog Cloud Apps',
  );
  const requireAdmin = useSelector((state) => state.dialogSetInstallationPath.form.requireAdmin);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={() => dispatch(close())}
      open={open}
    >
      <EnhancedDialogTitle onClose={() => dispatch(close())}>
        Set Custom Installation Path
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography align="center" variant="body2" className={classes.top}>
          Use at your own risk.
        </Typography>
        <TextField
          fullWidth
          id="installationPath"
          label="Installation path"
          margin="normal"
          value={installationPath}
          variant="outlined"
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={() => {
                    dialog.showOpenDialog(getCurrentWindow(), {
                      properties: ['openDirectory'],
                    })
                      .then(({ canceled, filePaths }) => {
                        if (!canceled && filePaths && filePaths.length > 0) {
                          dispatch(updateForm({ installationPath: filePaths[0] }));
                        }
                      })
                      .then(console.log); // eslint-disable-line
                  }}
                >
                  Change
                </Button>
              </InputAdornment>
            ),
          }}
        />
        {window.process.platform !== 'win32' && (
          <FormControlLabel
            control={(
              <Checkbox
                disabled={installationPath === '~/Applications/WebCatalog Apps' || installationPath === '/Applications/WebCatalog Apps'}
                checked={installationPath === '~/Applications/WebCatalog Apps' || installationPath === '/Applications/WebCatalog Apps' ? false : requireAdmin}
                onChange={(e) => dispatch(updateForm({ requireAdmin: e.target.checked }))}
              />
            )}
            label="Require sudo for installation"
          />
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={() => dispatch(close())}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => dispatch(save())}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSetInstallationPath;
