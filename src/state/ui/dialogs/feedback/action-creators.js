import {
  DIALOG_FEEDBACK_CLOSE,
  DIALOG_FEEDBACK_OPEN,
  DIALOG_FEEDBACK_FORM_UPDATE,
  DIALOG_FEEDBACK_SAVE_REQUEST,
  DIALOG_FEEDBACK_SAVE_SUCCESS,
} from '../../../../constants/actions';

export const dialogFeedbackClose = () => ({
  type: DIALOG_FEEDBACK_CLOSE,
});

export const dialogFeedbackOpen = () => ({
  type: DIALOG_FEEDBACK_OPEN,
});

export const dialogFeedbackFormUpdate = changes => ({
  type: DIALOG_FEEDBACK_FORM_UPDATE,
  changes,
});

export const dialogFeedbackSaveRequest = () => ({
  type: DIALOG_FEEDBACK_SAVE_REQUEST,
});

export const dialogFeedbackSaveSuccess = () => ({
  type: DIALOG_FEEDBACK_SAVE_SUCCESS,
});
