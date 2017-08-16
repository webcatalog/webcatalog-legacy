// import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogPreferencesBasicFormUpdate,
  dialogPreferencesBasicSaveRequest,
  dialogPreferencesBasicSaveSuccess,
} from './action-creators';

// import { patchUserPassword } from '../../../user/actions';

const hasErrors = (validatedChanges) => {
  console.log(validatedChanges);
  return false;
};

const validate = (changes, state) => {
  console.log(changes, state);
  return changes;
};

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getState());
    dispatch(dialogPreferencesBasicFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.preferences.basic.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogPreferencesBasicSaveRequest());
    return setTimeout(() => {
      dispatch(dialogPreferencesBasicSaveSuccess());
    }, 1500);
    // return dispatch(patchUserPassword(changes))
    //   .then(() => {
    //     dispatch(dialogPreferencesBasicSaveSuccess());
    //     dispatch(openSnackbar(
    //       'Your preferences have been saved!',
    //       'Close',
    //     ));
    //   });
  };
