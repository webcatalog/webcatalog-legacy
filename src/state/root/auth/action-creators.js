import {
  AUTH_SET_TOKEN,
} from '../../../constants/actions';

export const authSetToken = (token) => {
  if (token === null) {
    window.Intercom('shutdown');
  }

  return {
    type: AUTH_SET_TOKEN,
    token,
  };
};
