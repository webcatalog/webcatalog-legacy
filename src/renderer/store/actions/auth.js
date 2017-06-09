import { SIGN_IN, LOG_OUT } from '../constants/actions';

import { shutdownIntercom, bootIntercom } from './intercom';

export const signIn = token => (dispatch) => {
  dispatch({
    type: SIGN_IN,
    token,
  });

  dispatch(bootIntercom());
};

export const logOut = () => (dispatch) => {
  dispatch({ type: LOG_OUT });

  dispatch(shutdownIntercom());
};
