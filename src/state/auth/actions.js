import {
  AUTH_SET_TOKEN,
  AUTH_SET_EMAIL,
  AUTH_SET_PASSWORD,
} from '../../constants/actions';

export const setAuthToken = token => ({
  type: AUTH_SET_TOKEN,
  token,
});

export const setAuthEmail = email => ({
  type: AUTH_SET_EMAIL,
  email,
});


export const setAuthPassword = password => ({
  type: AUTH_SET_PASSWORD,
  password,
});
