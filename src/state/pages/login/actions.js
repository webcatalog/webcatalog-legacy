import {
  LOGIN_SET_EMAIL,
  LOGIN_SET_PASSWORD,
} from '../../../constants/actions';

export const setAuthEmail = email => ({
  type: LOGIN_SET_EMAIL,
  email,
});


export const setAuthPassword = password => ({
  type: LOGIN_SET_PASSWORD,
  password,
});
