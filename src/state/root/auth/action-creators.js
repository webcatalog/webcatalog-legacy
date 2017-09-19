import {
  AUTH_SET_TOKEN,
} from '../../../constants/actions';

export const authSetToken = token => ({
  type: AUTH_SET_TOKEN,
  token,
});
