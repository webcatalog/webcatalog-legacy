/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import slugify from 'slugify';
import {
  DIALOG_CREATE_CUSTOM_APP_CLOSE,
  DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_OPEN,
} from '../../constants/actions';

import hasErrors from '../../helpers/has-errors';
import isUrl from '../../helpers/is-url';
import validate from '../../helpers/validate';

import { open as openDialogChooseEngine } from '../dialog-choose-engine/actions';
import {
  isNameExisted,
  isIdExisted,
} from '../app-management/utils';

import { requestShowMessageBox } from '../../senders';

import swiftype from '../../swiftype';

export const close = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CLOSE,
});

export const open = (form) => ({
  type: DIALOG_CREATE_CUSTOM_APP_OPEN,
  form,
});

// to be replaced with invoke (electron 7+)
// https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
// attempt to get icon from manifest, favicon, etc of the URL first
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
  const {
    form: {
      name, url, urlDisabled, urlError,
    },
  } = getState().dialogCreateCustomApp;
  if (!url || urlDisabled || urlError) return;

  dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
    downloadingIcon: true,
  });
  requestCount += 1;

  getWebsiteIconUrlAsync(url, name)
    .then((iconUrl) => {
      const { form } = getState().dialogCreateCustomApp;
      if (form.url === url) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
          changes,
        }));
      }

      if (!iconUrl) {
        return window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from the URL.',
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
        type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
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
    type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
    downloadingIcon: true,
  });
  requestCount += 1;

  getWebsiteIconUrlFromSwifttypeAsync(url, name)
    .then((iconUrl) => {
      const { form } = getState().dialogCreateCustomApp;
      if (form.url === url) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
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
        type: DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
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
  const { urlDisabled } = getState().dialogCreateCustomApp.form;

  dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
    changes: validate(changes, getValidationRules(urlDisabled)),
  });
};

export const create = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogCreateCustomApp;

  const validatedChanges = validate(form, getValidationRules(form.urlDisabled));
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const { name, url, urlDisabled } = form;

  // id max length: 43 chars
  // if longer, it would crash the app on macOS (https://github.com/webcatalog/webcatalog-app/pull/1328)
  let id = `custom-${Date.now().toString()}`;

  // attempt to use name slug as ID
  const slug = slugify(name, {
    lower: true,
  });
  // if the slug is longer than 16 chars, it would crash the app on macOS (https://github.com/webcatalog/webcatalog-app/pull/1328)
  // avoid using substring(0, 16)
  // as it might lead to conflicts in the future (backup & restore, for example)
  if (slug.length > 0 && slug.length <= 16 && !isIdExisted(`custom-${slug}`, state)) {
    id = `custom-${slug}`;
  }

  const icon = form.icon || form.internetIcon || window.remote.getGlobal('defaultIcon');
  const protocolledUrl = isUrl(url) ? url : `http://${url}`;

  const opts = window.process.platform === 'linux' ? {
    freedesktopMainCategory: form.freedesktopMainCategory,
    freedesktopAdditionalCategory: form.freedesktopAdditionalCategory,
  } : undefined;

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(openDialogChooseEngine(id, name, urlDisabled ? null : protocolledUrl, icon, opts));

  dispatch(close());
  return null;
};
