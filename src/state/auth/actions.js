import {
  SET_AUTH_TOKEN,
  SET_AUTH_EMAIL,
  SET_AUTH_PASSWORD,
} from '../../constants/actions';

export const setAuthToken = token => ({
  type: SET_AUTH_TOKEN,
  token,
});

export const setAuthEmail = email => ({
  type: SET_AUTH_EMAIL,
  email,
});


export const setAuthPassword = password => ({
  type: SET_AUTH_PASSWORD,
  password,
});
