import { openSnackbar } from '../../snackbar/actions';

import {
  dialogFeedbackClose,
  dialogFeedbackOpen,
  dialogFeedbackFormUpdate,
  dialogFeedbackSaveRequest,
  dialogFeedbackSaveSuccess,
} from './action-creators';

import { postDraft } from '../../../drafts/actions';

export const close = () =>
  (dispatch) => {
    dispatch(dialogFeedbackClose());
  };

export const formUpdate = changes =>
  (dispatch) => {
    dispatch(dialogFeedbackFormUpdate(changes));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogFeedbackOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().ui.dialogs.feedback.form;
    dispatch(dialogFeedbackSaveRequest());
    return dispatch(postDraft(data))
      .then(() => {
        dispatch(dialogFeedbackSaveSuccess());
        dispatch(openSnackbar(
          'Your feedback has been sent!',
          'Got it!',
        ));
        dispatch(dialogFeedbackClose());
      });
  };
