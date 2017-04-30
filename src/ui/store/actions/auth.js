import { SIGN_IN } from '../constants/actions';

export const signIn = token => (dispatch) => {
  dispatch({
    type: SIGN_IN,
    token,
  });
};
