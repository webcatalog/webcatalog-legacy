import validate from '../../../helpers/validate';
import hasErrors from '../../../helpers/has-errors';

import { openSnackbar } from '../../root/snackbar/actions';

import {
  dialogSubmitAppClose,
  dialogSubmitAppOpen,
  dialogSubmitAppFormUpdate,
  dialogSubmitAppSaveRequest,
  dialogSubmitAppSaveSuccess,
  dialogSubmitAppSaveFailed,
} from './action-creators';

import { apiPost } from '../../api';

const getValidationRules = () => ({
  name: {
    fieldName: 'App name',
    required: true,
    maxLength: 100,
  },
  url: {
    fieldName: 'App URL',
    required: true,
    url: true,
  },
});

export const close = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppClose());
  };

export const formUpdate = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(dialogSubmitAppFormUpdate(validatedChanges));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().dialogs.submitApp.form;

    const validatedChanges = validate(data, getValidationRules());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogSubmitAppSaveRequest());
    return dispatch(apiPost('/drafts', data))
      .then(() => {
        dispatch(dialogSubmitAppSaveSuccess());
        dispatch(openSnackbar(
          'Your app has been submitted for review!',
        ));
      })
      .catch(() => {
        dispatch(dialogSubmitAppSaveFailed());
        dispatch(openSnackbar(
          'WebCatalog is having trouble connecting to our server.',
        ));
      });
  };
