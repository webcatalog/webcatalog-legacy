import {
  draftsPostRequest,
  draftsPostSuccess,
} from './action-creators';
import { apiPost } from '../api';

export const postDraft = (data) =>
  (dispatch) => {
    dispatch(draftsPostRequest());
    return dispatch(apiPost('/drafts', data))
      .then(res => res.json())
      .then(() => dispatch(draftsPostSuccess()));
  };

export default { postDraft };
