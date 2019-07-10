import validate from '../../../helpers/validate';
import hasErrors from '../../../helpers/has-errors';

import { openSnackbar } from '../../root/snackbar/actions';
import { getUser } from '../../root/user/actions';

import {
  dialogAccountProfileClose,
  dialogAccountProfileFormUpdate,
  dialogAccountProfileOpen,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

import { apiPatch } from '../../api';

const getValidationRules = () => ({
  email: {
    fieldName: 'Email',
    required: true,
  },
});

export const formUpdate = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(dialogAccountProfileFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.profile.form;

    const validatedChanges = validate(changes, getValidationRules());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogAccountProfileSaveRequest());
    return dispatch(apiPatch('/user', changes))
      .then(() => {
        dispatch(dialogAccountProfileSaveSuccess());
        dispatch(openSnackbar('Your profile has been saved!'));
        dispatch(getUser());
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your profile information.')));
  };

const initializeProfileForm = () =>
  (dispatch, getState) => {
    const {
      displayName,
      email,
    } = getState().user.apiData;

    const initializeData = {
      displayName,
      email,
    };

    dispatch(formUpdate(initializeData));
  };

export const close = () =>
  dispatch => dispatch(dialogAccountProfileClose());

export const open = () =>
  (dispatch) => {
    dispatch(initializeProfileForm());
    dispatch(dialogAccountProfileOpen());
  };
