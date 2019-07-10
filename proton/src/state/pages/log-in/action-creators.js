import {
  LOG_IN_FORM_UPDATE,
  LOG_IN_SUBMIT_REQUEST,
  LOG_IN_SUBMIT_SUCCESS,
  LOG_IN_SUBMIT_FAILED,
} from '../../../constants/actions';

export const logInFormUpdate = changes => ({
  type: LOG_IN_FORM_UPDATE,
  changes,
});

export const logInSubmitRequest = () => ({
  type: LOG_IN_SUBMIT_REQUEST,
});

export const logInSubmitSuccess = () => ({
  type: LOG_IN_SUBMIT_SUCCESS,
});

export const logInSubmitFailed = () => ({
  type: LOG_IN_SUBMIT_FAILED,
});
