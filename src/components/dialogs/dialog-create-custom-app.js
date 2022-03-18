/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { dialog } from '@electron/remote';

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
import Typography from '@material-ui/core/Typography';

import isUrl from '../../helpers/is-url';

import freedesktopMainCategories from '../../constants/freedesktop-main-categories';
import freedesktopAdditionalCategories from '../../constants/freedesktop-additional-categories';

import {
  requestOpenInBrowser,
} from '../../senders';

import {
  close,
  create,
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
} from '../../state/dialog-create-custom-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  iconContainer: {
    height: 96,
    width: 96,
    backgroundColor: theme.palette.common.minBlack,
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
    backgroundColor: theme.palette.common.white,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
  link: {
    cursor: 'pointer',
  },
}));

const DialogCreateCustomApp = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogCreateCustomApp.open);
  const downloadingIcon = useSelector((state) => state.dialogCreateCustomApp.downloadingIcon);

  const applyIconTemplate = useSelector(
    (state) => state.dialogCreateCustomApp.form.applyIconTemplate,
  );
  const icon = useSelector((state) => state.dialogCreateCustomApp.form.icon);
  const internetIcon = useSelector((state) => state.dialogCreateCustomApp.form.internetIcon);
  const name = useSelector((state) => state.dialogCreateCustomApp.form.name);
  const nameError = useSelector((state) => state.dialogCreateCustomApp.form.nameError);
  const url = useSelector((state) => state.dialogCreateCustomApp.form.url);
  const urlDisabled = useSelector((state) => state.dialogCreateCustomApp.form.urlDisabled);
  const urlError = useSelector((state) => state.dialogCreateCustomApp.form.urlError);
  const freedesktopAdditionalCategory = useSelector(
    (state) => state.dialogCreateCustomApp.form.freedesktopAdditionalCategory,
  );
  const freedesktopMainCategory = useSelector(
    (state) => state.dialogCreateCustomApp.form.freedesktopMainCategory,
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
        {urlDisabled ? 'Create Custom Space' : 'Create Custom App'}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label="Name"
          helperText={nameError}
          margin="dense"
          onChange={(e) => dispatch(updateForm({ name: e.target.value }))}
          value={name}
          error={Boolean(nameError)}
          variant="outlined"
        />
        {/* <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="input-type-label">Classification</InputLabel>
          <Select
            id="input-type"
            labelId="input-type-label"
            value={urlDisabled}
            onChange={(event) => onUpdateForm({ urlDisabled: event.target.value })}
            label="Classification"
            margin="dense"
          >
            <MenuItem value={false}>App</MenuItem>
            <MenuItem value>Space</MenuItem>
          </Select>
          <FormHelperText>
            <Link
              onClick={() => requestOpenInBrowser('https://docs.webcatalog.io/article/18-what-is-the-difference-between-standard-apps-and-multisite-apps')}
              className={classes.link}
            >
              What is the difference between apps and spaces?
            </Link>
          </FormHelperText>
        </FormControl> */}
        {!urlDisabled && (
          <TextField
            fullWidth
            id="url"
            label="URL"
            helperText={urlError}
            margin="dense"
            onChange={(e) => dispatch(updateForm({ url: e.target.value }))}
            value={urlDisabled ? 'No URL specified.' : url}
            disabled={urlDisabled}
            error={Boolean(urlError)}
            variant="outlined"
          />
        )}
        <Grid container spacing={1} className={classes.grid}>
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
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                dialog.showOpenDialog({
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
              disabled={downloadingIcon}
            >
              Select Local Image...
            </Button>
            <Typography variant="caption" className={classes.caption}>
              PNG, JPEG, GIF, TIFF or BMP.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonBot}
              disabled={Boolean(!url || urlError || urlDisabled || downloadingIcon)}
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
                    onChange={(e) => dispatch(updateForm({ applyIconTemplate: e.target.checked }))}
                    name="applyIconTemplate"
                    color="primary"
                  />
                )}
                label="Add shadows and rounded corners"
              />
            </FormGroup>
          </Grid>
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
                onChange={(event) => dispatch(updateForm({
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
                onChange={(event) => dispatch(updateForm({
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
        <Button
          onClick={() => dispatch(close())}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => dispatch(create())}
        >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCreateCustomApp;
