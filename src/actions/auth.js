import {
  SET_AUTH_TOKEN,
} from '../constants/actions';

/* eslint-disable import/prefer-default-export */
export const setAuthToken = token => ({
  type: SET_AUTH_TOKEN,
  token,
});
