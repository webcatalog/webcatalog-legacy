import {
  AUTH_SET_TOKEN,
} from '../../../constants/actions';

export const setAuthToken = token => ({
  type: AUTH_SET_TOKEN,
  token,
});
