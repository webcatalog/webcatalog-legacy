import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAILED,
} from '../../../constants/actions';

export const userGetRequest = () => ({
  type: USER_GET_REQUEST,
});

export const userGetSuccess = (res) => {
  window.Intercom('boot', {
    app_id: 'rzjr1fun',
    email: res.email,
    user_id: res.id,
    user_hash: res.intercomUserHash,
    signed_up_at: Math.floor(new Date(res.createdAt).getTime() / 1000),
  });

  return {
    type: USER_GET_SUCCESS,
    res,
  };
};

export const userGetFailed = () => ({
  type: USER_GET_FAILED,
});
