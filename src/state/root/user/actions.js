import { openSnackbar } from '../snackbar/actions';

import {
  userGetRequest,
  userGetSuccess,
} from './action-creators';
import {
  apiGet,
} from '../../api';

export const getUser = () =>
  (dispatch) => {
    dispatch(userGetRequest());
    return dispatch(apiGet('/user'))
      .then(res => dispatch(userGetSuccess({ ...res.user })))
      .catch(() => dispatch(openSnackbar('WebCatalog failed to get your profile information.')));
  };

export default {
  getUser,
};
