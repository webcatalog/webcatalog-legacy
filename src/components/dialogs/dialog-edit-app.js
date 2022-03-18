/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import isUrl from '../../helpers/is-url';

import {
  close,
  save,
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
  updateFormOpts,
} from '../../state/dialog-edit-app/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import freedesktopMainCategories from '../../constants/freedesktop-main-categories';
import freedesktopAdditionalCategories from '../../constants/freedesktop-additional-categories';

import {
  requestOpenInBrowser,
} from '../../senders';

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  iconContainer: {
    height: 96,
    width: 96,
  },
  icon: {
    height: 96,
    width: 96,
  },
  iconContainerPlated: {
    height: 96,
    width: 96,
    // 100/1024 * 96
    padding: 9,
  },
  iconPlated: {
    height: 78,
    width: 78,
    boxShadow: theme.shadows[1],
    // 96 * 22.375%
    borderRadius: 21,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
    display: 'flex',
  },
  dialogActionsLeft: {
    flex: 1,
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
  captionDisabled: {
    color: theme.palette.text.disabled,
  },
  link: {
    cursor: 'pointer',
  },
}));

const DialogEditApp = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogEditApp.open);
  const downloadingIcon = useSelector((state) => state.dialogCreateCustomApp.downloadingIcon);
  const savable = useSelector((state) => state.dialogEditApp.savable);

  const applyIconTemplate = useSelector((state) => state.dialogEditApp.form.applyIconTemplate);
  const icon = useSelector((state) => state.dialogEditApp.form.icon);
  const id = useSelector((state) => state.dialogEditApp.form.id);
  const internetIcon = useSelector((state) => state.dialogEditApp.form.internetIcon);
  const name = useSelector((state) => state.dialogEditApp.form.name);
  const url = useSelector((state) => state.dialogEditApp.form.url);
  const urlDisabled = useSelector((state) => state.dialogEditApp.form.urlDisabled);
  const urlError = useSelector((state) => state.dialogEditApp.form.urlError);
  const freedesktopAdditionalCategory = useSelector(
    (state) => (state.dialogEditApp.form.opts || {}).freedesktopAdditionalCategory,
  );
  const freedesktopMainCategory = useSelector(
    (state) => (state.dialogEditApp.form.opts || {}).freedesktopMainCategory,
  );

  let iconPath = defaultIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
  } else if (internetIcon) {
    iconPath = internetIcon;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={() => dispatch(close())}
      open={open}
    >
      <EnhancedDialogTitle onClose={() => dispatch(close())}>
        {`Edit "${name}"`}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label="Name"
          helperText={`This cannot be changed. To customize the name, clone "${name}".`}
          margin="normal"
          onChange={(e) => dispatch(updateForm({ name: e.target.value }))}
          value={name}
          disabled
        />
        {!urlDisabled && (
          <TextField
            fullWidth
            id="url"
            label="URL"
            helperText={urlError}
            margin="normal"
            onChange={(e) => dispatch(updateForm({ url: e.target.value }))}
            value={url}
            error={Boolean(urlError)}
          />
        )}
        <Grid container spacing={1} className={classes.grid} wrap="nowrap">
          <Grid item xs={12} sm="auto">
            {applyIconTemplate ? (
              <div className={classes.iconContainerPlated}>
                <img src={iconPath} alt={name} className={classes.iconPlated} />
              </div>
            ) : (
              <div className={classes.iconContainer}>
                <img src={iconPath} alt={name} className={classes.icon} />
              </div>
            )}
          </Grid>
          {!id || !id.startsWith('custom-') ? (
            <Grid item xs={12} sm="auto">
              <Typography
                variant="body2"
                className={classnames(classes.caption, classes.captionDisabled)}
              >
                This app icon is managed by WebCatalog and is not editable. To customize the icon,
                {` clone "${name}".`}
              </Typography>
            </Grid>
          ) : (
            <Grid item xs={12} sm="auto">
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  window.remote.dialog.showOpenDialog({
                    filters: [
                      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif', 'bmp', 'dib'] },
                    ],
                    properties: ['openFile'],
                  })
                    .then(({ canceled, filePaths }) => {
                      if (!canceled && filePaths && filePaths.length > 0) {
                        dispatch(updateForm({ icon: filePaths[0] }));
                      }
                    })
                    .catch(console.log); // eslint-disable-line
                }}
              >
                Select Local Image...
              </Button>
              <Typography
                variant="caption"
                className={classes.caption}
              >
                PNG, JPEG, GIF, TIFF or BMP.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                className={classes.buttonBot}
                disabled={Boolean(!url || urlError || downloadingIcon)}
                onClick={() => dispatch(getIconFromInternet())}
              >
                {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
              </Button>
              <br />
              <Button
                variant="outlined"
                size="small"
                className={classes.buttonBot}
                disabled={Boolean(!url || urlError || urlDisabled || downloadingIcon)}
                onClick={() => dispatch(getIconFromAppSearch())}
              >
                {downloadingIcon ? 'Downloading...' : 'Download Icon from WebCatalog'}
              </Button>
              <br />
              <Button
                variant="outlined"
                size="small"
                className={classes.buttonBot}
                disabled={!(icon || internetIcon) || downloadingIcon}
                onClick={() => dispatch(updateForm({ icon: null, internetIcon: null }))}
              >
                Reset to Default
              </Button>
              <br />
              <FormGroup row>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={applyIconTemplate}
                      onChange={(e) => dispatch(updateForm({
                        applyIconTemplate: e.target.checked,
                      }))}
                      name="applyIconTemplate"
                      color="primary"
                    />
                  )}
                  label="Add shadows and rounded corners"
                />
              </FormGroup>
            </Grid>
          )}
        </Grid>
        {window.process.platform === 'linux' && (
          <>
            <br />
            <Divider />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="input-main-category-label">Main Category</InputLabel>
              <Select
                id="input-main-category"
                labelId="input-main-category-label"
                value={freedesktopMainCategory}
                onChange={(event) => dispatch(updateFormOpts({
                  freedesktopMainCategory: event.target.value,
                  freedesktopAdditionalCategory: '',
                }))}
                label="Type"
                margin="dense"
              >
                {freedesktopMainCategories
                  .map((val) => (
                    <MenuItem key={val} value={val}>{val}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="input-additional-category-label">Additional Category</InputLabel>
              <Select
                id="input-additional-category"
                labelId="input-additional-category-label"
                value={freedesktopAdditionalCategory === '' ? '_' : freedesktopAdditionalCategory}
                onChange={(event) => dispatch(updateFormOpts({
                  freedesktopAdditionalCategory: event.target.value === '_' ? '' : event.target.value,
                }))}
                label="Type"
                margin="dense"
              >
                <MenuItem value="_">(blank)</MenuItem>
                {freedesktopAdditionalCategories
                  .filter((val) => (!val.relatedMainCategories
                    || val.relatedMainCategories.includes(freedesktopMainCategory)))
                  .map((val) => (
                    <MenuItem key={val.name} value={val.name}>{val.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText>
                <span>
                  Specify which section of the system application menu this app belongs to.&nbsp;
                </span>
                <Link
                  onClick={() => requestOpenInBrowser('https://specifications.freedesktop.org/menu-spec/latest/apa.html')}
                  className={classes.link}
                >
                  Learn more about Freedesktop.org specifications
                </Link>
                <span>.</span>
              </FormHelperText>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div className={classes.dialogActionsLeft}>
          <Button
            onClick={() => {
              dispatch(close());
              dispatch(openDialogCreateCustomApp({
                name: `${name} 2`,
                url,
                urlDisabled: Boolean(!url),
                icon,
              }));
            }}
          >
            Clone
          </Button>
        </div>
        <div>
          <Button
            onClick={() => dispatch(close())}
          >
            Cancel
          </Button>
          <Tooltip title="This action'll also update this app to the latest version">
            <Button
              color="primary"
              onClick={() => dispatch(save())}
              disabled={!savable}
            >
              Save
            </Button>
          </Tooltip>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditApp;
