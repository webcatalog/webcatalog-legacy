import { SIGN_IN, LOG_OUT } from '../constants/actions';

import { updateIntercomUser, shutdownIntercom, bootIntercom } from './intercom';

export const signIn = token => (dispatch) => {
  dispatch({
    type: SIGN_IN,
    token,
  });

  dispatch(updateIntercomUser(token));
};

export const logOut = () => (dispatch) => {
  dispatch({ type: LOG_OUT });

  dispatch(shutdownIntercom());
  dispatch(bootIntercom());
};
