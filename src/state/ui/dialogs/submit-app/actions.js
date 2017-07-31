import { openSnackbar } from '../../snackbar/actions';

import {
  dialogSubmitAppClose,
  dialogSubmitAppOpen,
  dialogSubmitAppFormUpdate,
  dialogSubmitAppSaveRequest,
  dialogSubmitAppSaveSuccess,
} from './action-creators';

import { postDraft } from '../../../drafts/actions';

export const close = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppClose());
  };

export const formUpdate = changes =>
  (dispatch) => {
    dispatch(dialogSubmitAppFormUpdate(changes));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().ui.dialogs.submitApp.form;
    dispatch(dialogSubmitAppSaveRequest());
    return dispatch(postDraft(data))
      .then(() => {
        dispatch(dialogSubmitAppSaveSuccess());
        dispatch(openSnackbar(
          'Your app has been submitted for review!',
          'Got it!',
        ));
        dispatch(dialogSubmitAppClose());
      });
  };
