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
import getStaticGlobal from '../../helpers/get-static-global';

import { installApp } from '../app-management/actions';
import {
  isNameExisted,
} from '../app-management/utils';

import { requestShowMessageBox } from '../../senders';

import appSearch from '../../app-search';

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
  return appSearch
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

export const getIconFromAppSearch = () => (dispatch, getState) => {
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
  const id = `custom-${Date.now().toString()}`;

  const icon = form.icon || form.internetIcon || getStaticGlobal('defaultIcon');
  const protocolledUrl = isUrl(url) ? url : `http://${url}`;

  const opts = {};
  if (window.process.platform === 'linux') {
    opts.freedesktopMainCategory = form.freedesktopMainCategory;
    opts.freedesktopAdditionalCategory = form.freedesktopAdditionalCategory;
  }

  // custom app ID makes it hard to identify app directories in Finder
  // see https://github.com/webcatalog/webcatalog-app/issues/1327
  // so we will try to append slug to app data dir name if possible
  // opts.slug is used by webcatalog-engine for the mentioned purpose
  const slug = slugify(name, {
    lower: true,
  });
  if (slug.length > 0) {
    opts.slug = slug;
  }

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(installApp(id, name, urlDisabled ? null : protocolledUrl, icon, opts));

  dispatch(close());
  return null;
};
