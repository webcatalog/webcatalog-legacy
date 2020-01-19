
import {
  DIALOG_CREATE_CUSTOM_APP_CLOSE,
  DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_OPEN,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import { open as openDialogChooseEngine } from '../dialog-choose-engine/actions';
import {
  isNameExisted,
  getAppCount,
} from '../app-management/utils';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

import { requestShowMessageBox } from '../../senders';

const { remote, ipcRenderer } = window.require('electron');

export const close = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CLOSE,
});

export const open = (form) => (dispatch, getState) => {
  const state = getState();

  const shouldAskForLicense = !state.preferences.registered && getAppCount(state) > 1;

  if (shouldAskForLicense) {
    return dispatch(openDialogLicenseRegistration());
  }

  return dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_OPEN,
    form,
  });
};

// to be replaced with invoke (electron 7+)
// https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
export const getWebsiteIconUrlAsync = (url) => new Promise((resolve, reject) => {
  try {
    const id = Date.now().toString();
    ipcRenderer.once(id, (e, uurl) => {
      resolve(uurl);
    });
    ipcRenderer.send('request-get-website-icon-url', id, url);
  } catch (err) {
    reject(err);
  }
});

let requestCount = 0;
export const getIconFromInternet = (forceOverwrite) => (dispatch, getState) => {
  const { form: { icon, url, urlError } } = getState().dialogCreateCustomApp;
  if ((!forceOverwrite && icon) || !url || urlError) return;

  dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
    downloadingIcon: true,
  });
  requestCount += 1;

  getWebsiteIconUrlAsync(url)
    .then((iconUrl) => {
      const { form } = getState().dialogCreateCustomApp;
      if (form.url === url) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        if (forceOverwrite) changes.icon = null;
        dispatch(({
          type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
          changes,
        }));
      }

      if (forceOverwrite && !iconUrl) {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from the Internet.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }
    }).catch(console.log) // eslint-disable-line no-console
    .then(() => {
      requestCount -= 1;
      dispatch({
        type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
        downloadingIcon: requestCount > 0,
      });
    });
};

const getValidationRules = () => ({
  name: {
    fieldName: 'Name',
    required: true,
    filePath: true,
  },
  url: {
    fieldName: 'URL',
    required: true,
    url: true,
  },
});

let timeout;
export const updateForm = (changes) => (dispatch) => {
  dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
    changes: validate(changes, getValidationRules()),
  });

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (changes.internetIcon === null) return; // user explictly want to get rid of icon
    dispatch(getIconFromInternet());
  }, 300);
};

export const create = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogCreateCustomApp;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const id = `custom-${Date.now().toString()}`;
  const { name, url } = form;
  const icon = form.icon || remote.getGlobal('defaultIcon');

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(openDialogChooseEngine(id, name, url, icon));

  dispatch(close());
  return null;
};
