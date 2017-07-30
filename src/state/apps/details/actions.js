import {
  appsDetailsGetRequest,
  appsDetailsGetSuccess,
} from './action-creators';
import { apiGet } from '../../api';

export const getAppDetails = () =>
  (dispatch, getState) => {
    dispatch(appsDetailsGetRequest());
    dispatch(apiGet(`/apps/${getState().ui.dialogs.appDetails.form.id}`))
      .then(res => res.json())
      .then(res => dispatch(appsDetailsGetSuccess(res)))
      .catch(() => {});
  };
