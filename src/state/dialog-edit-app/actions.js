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

export const save = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogEditApp;
  const {
    engine, id, name, url, urlDisabled,
  } = form;

  const validatedChanges = validate(form, getValidationRules(urlDisabled));
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const icon = form.icon || form.internetIcon || window.remote.getGlobal('defaultIcon');
  const protocolledUrl = isUrl(url) ? url : `http://${url}`;

  dispatch(updateApp(engine, id, name, urlDisabled ? null : protocolledUrl, icon));

  dispatch(close());
  return null;
};
