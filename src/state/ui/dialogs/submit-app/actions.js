import { openSnackbar } from '../../snackbar/actions';

import isUrl from '../../../../utils/isUrl';

import {
  dialogSubmitAppClose,
  dialogSubmitAppOpen,
  dialogSubmitAppFormUpdate,
  dialogSubmitAppSaveRequest,
  dialogSubmitAppSaveSuccess,
} from './action-creators';

import { apiPost } from '../../../api';

const hasErrors = (validatedChanges) => {
  if (validatedChanges.nameError || validatedChanges.urlError) {
    return true;
  }
  return false;
};

const validate = (changes) => {
  const {
    name,
    url,
  } = changes;

  const newChanges = changes;

  if (name || name === '') {
    const key = name;
    if (key.length === 0) newChanges.nameError = 'Enter the app name';
    else if (key.length > 100) newChanges.nameError = 'Must be less than 100 characters';
    else newChanges.nameError = null;
  }

  if (url || url === '') {
    const key = url;
    if (key.length === 0) newChanges.urlError = 'Enter the app url';
    else if (!isUrl(key)) newChanges.urlError = 'Enter a valid url';
    else newChanges.urlError = null;
  }

  return newChanges;
};

export const close = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppClose());
  };

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getState());
    dispatch(dialogSubmitAppFormUpdate(validatedChanges));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().ui.dialogs.submitApp.form;

    const validatedChanges = validate(data, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogSubmitAppSaveRequest());
    return dispatch(apiPost('/drafts', data))
      .then(() => {
        dispatch(dialogSubmitAppSaveSuccess());
        dispatch(openSnackbar(
          'Your app has been submitted for review!',
          'Got it!',
        ));
        dispatch(dialogSubmitAppClose());
      });
  };
