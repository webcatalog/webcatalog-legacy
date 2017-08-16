// import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogSettingsAdvancedFormUpdate,
  dialogSettingsAdvancedSaveRequest,
  dialogSettingsAdvancedSaveSuccess,
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
    dispatch(dialogSettingsAdvancedFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.settings.basic.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogSettingsAdvancedSaveRequest());
    return setTimeout(() => {
      dispatch(dialogSettingsAdvancedSaveSuccess());
    }, 1500);
    // return dispatch(patchUserPassword(changes))
    //   .then(() => {
    //     dispatch(dialogSettingsAdvancedSaveSuccess());
    //     dispatch(openSnackbar(
    //       'Your settings have been saved!',
    //       'Close',
    //     ));
    //   });
  };
