// import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogSettingsBasicFormUpdate,
  dialogSettingsBasicSaveRequest,
  dialogSettingsBasicSaveSuccess,
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
    dispatch(dialogSettingsBasicFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.settings.basic.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogSettingsBasicSaveRequest());
    return setTimeout(() => {
      dispatch(dialogSettingsBasicSaveSuccess());
    }, 1500);
    // return dispatch(patchUserPassword(changes))
    //   .then(() => {
    //     dispatch(dialogSettingsBasicSaveSuccess());
    //     dispatch(openSnackbar(
    //       'Your settings have been saved!',
    //       'Close',
    //     ));
    //   });
  };
