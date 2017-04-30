import { SIGN_IN, LOG_OUT } from '../constants/actions';

export const signIn = token => (dispatch) => {
  dispatch({
    type: SIGN_IN,
    token,
  });
};

export const logOut = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
};
