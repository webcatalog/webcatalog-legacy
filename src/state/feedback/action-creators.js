import {
  FEEDBACK_POST_REQUEST,
  FEEDBACK_POST_SUCCESS,
} from '../../constants/actions';

export const feedbackPostRequest = () => ({
  type: FEEDBACK_POST_REQUEST,
});

export const feedbackPostSuccess = res => ({
  type: FEEDBACK_POST_SUCCESS,
  res,
});
