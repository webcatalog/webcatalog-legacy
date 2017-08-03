import {
  DRAFTS_POST_REQUEST,
  DRAFTS_POST_SUCCESS,
} from '../../constants/actions';

export const draftsPostRequest = () => ({
  type: DRAFTS_POST_REQUEST,
});

export const draftsPostSuccess = res => ({
  type: DRAFTS_POST_SUCCESS,
  res,
});
