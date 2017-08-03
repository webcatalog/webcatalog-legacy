import {
  feedbackPostRequest,
  feedbackPostSuccess,
} from './action-creators';
import { apiPost } from '../api';

export const postFeedback = data =>
  (dispatch) => {
    dispatch(feedbackPostRequest());
    return dispatch(apiPost('/feedback', data))
      .then(res => res.json())
      .then(() => dispatch(feedbackPostSuccess()));
  };

export default { postFeedback };
