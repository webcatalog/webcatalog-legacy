// import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogPreferencesAdvancedFormUpdate,
  dialogPreferencesAdvancedSaveRequest,
  dialogPreferencesAdvancedSaveSuccess,
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
    dispatch(dialogPreferencesAdvancedFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.preferences.basic.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogPreferencesAdvancedSaveRequest());
    return setTimeout(() => {
      dispatch(dialogPreferencesAdvancedSaveSuccess());
    }, 1500);
    // return dispatch(patchUserPassword(changes))
    //   .then(() => {
    //     dispatch(dialogPreferencesAdvancedSaveSuccess());
    //     dispatch(openSnackbar(
    //       'Your preferences have been saved!',
    //       'Close',
    //     ));
    //   });
  };
