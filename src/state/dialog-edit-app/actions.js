/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_EDIT_APP_CLOSE,
  DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
  DIALOG_EDIT_APP_FORM_UPDATE,
  DIALOG_EDIT_APP_OPEN,
} from '../../constants/actions';

import hasErrors from '../../helpers/has-errors';
import isUrl from '../../helpers/is-url';
import validate from '../../helpers/validate';

import { updateApp } from '../app-management/actions';

import swiftype from '../../swiftype';

export const close = () => ({
  type: DIALOG_EDIT_APP_CLOSE,
});

export const open = (form) => ({
  type: DIALOG_EDIT_APP_OPEN,
  form,
});

// to be replaced with invoke (electron 7+)
// https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
export const getWebsiteIconUrlAsync = (url) => new Promise((resolve, reject) => {
  try {
    const id = Date.now().toString();
    window.ipcRenderer.once(id, (e, uurl) => {
      resolve(uurl);
    });
    window.ipcRenderer.send('request-get-website-icon-url', id, url);
  } catch (err) {
    reject(err);
  }
});

export const getWebsiteIconUrlFromSwifttypeAsync = (url, name) => {
  // if it fails, try to get icon from in-house database
  const query = name && name.length > 0 ? `${url} ${name}` : url;
  return swiftype
    .search(query, {
      search_fields: {
        name: {},
        url: { weight: 5 },
      },
      result_fields: {
        icon: window.process.platform === 'win32' ? undefined : { raw: {} },
        icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
      },
      page: { size: 1 },
    })
    .then((res) => {
      if (res.rawResults.length < 1) return null;
      const app = res.rawResults[0];
      return window.process.platform === 'win32' ? app.icon_unplated.raw : app.icon.raw;
    })
    .catch(() => null);
};

let requestCount = 0;
export const getIconFromInternet = () => (dispatch, getState) => {
  const { form: { url, urlDisabled, urlError } } = getState().dialogEditApp;
  if (!url || urlDisabled || urlError) return;

  dispatch({
    type: DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
    downloadingIcon: true,
  });
  requestCount += 1;

  getWebsiteIconUrlAsync(url)
    .then((iconUrl) => {
      const { form } = getState().dialogEditApp;
      if (form.url === url) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: DIALOG_EDIT_APP_FORM_UPDATE,
          changes,
        }));
      }

      if (!iconUrl) {
        return window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from the Internet.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }

      return null;
    }).catch(console.log) // eslint-disable-line no-console
    .then(() => {
      requestCount -= 1;
      dispatch({
        type: DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
        downloadingIcon: requestCount > 0,
      });
    });
};

export const getIconFromSwiftype = () => (dispatch, getState) => {
  const {
    form: {
      name, url, urlDisabled, urlError,
    },
  } = getState().dialogCreateCustomApp;
  if (!url || urlDisabled || urlError) return;

  dispatch({
    type: DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
    downloadingIcon: true,
  });
  requestCount += 1;

  getWebsiteIconUrlFromSwifttypeAsync(url, name)
    .then((iconUrl) => {
      const { form } = getState().dialogCreateCustomApp;
      if (form.url === url) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: DIALOG_EDIT_APP_FORM_UPDATE,
          changes,
        }));
      }

      if (!iconUrl) {
        return window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from WebCatalog\'s database.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }

      return null;
    }).catch(console.log) // eslint-disable-line no-console
    .then(() => {
      requestCount -= 1;
      dispatch({
        type: DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
        downloadingIcon: requestCount > 0,
      });
    });
};

const getValidationRules = (urlDisabled) => ({
  name: {
    fieldName: 'Name',
    required: true,
    filePath: true,
  },
  url: !urlDisabled ? {
    fieldName: 'URL',
    required: true,
    lessStrictUrl: true,
  } : undefined,
});

export const updateForm = (changes) => (dispatch, getState) => {
  const { urlDisabled } = getState().dialogEditApp.form;

  dispatch({
    type: DIALOG_EDIT_APP_FORM_UPDATE,
    changes: validate(changes, getValidationRules(urlDisabled)),
  });
};

export const updateFormOpts = (optsChanges) => (dispatch, getState) => {
  const { opts } = getState().dialogEditApp.form;

  dispatch({
    type: DIALOG_EDIT_APP_FORM_UPDATE,
    changes: {
      opts: {
        ...opts,
        ...optsChanges,
      },
    },
  });
};

export const save = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogEditApp;
  const {
    id,
    name,
    url,
    urlDisabled,
  } = form;

  const opts = { ...form.opts };
  if (window.process.platform === 'linux') {
    opts.freedesktopMainCategory = form.opts.freedesktopMainCategory || 'Network';
    opts.freedesktopAdditionalCategory = form.opts.freedesktopAdditionalCategory == null
      ? 'WebBrowser' : form.opts.freedesktopAdditionalCategory;
  }

  const validatedChanges = validate(form, getValidationRules(urlDisabled));
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const icon = form.icon || form.internetIcon || window.remote.getGlobal('defaultIcon');
  const protocolledUrl = isUrl(url) ? url : `http://${url}`;

  dispatch(updateApp(id, name, urlDisabled ? null : protocolledUrl, icon, opts));

  dispatch(close());
  return null;
};
