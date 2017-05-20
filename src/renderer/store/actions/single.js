import Immutable from 'immutable';

import { SET_SINGLE_APP, SET_SINGLE_IS_FAILED } from '../constants/actions';

import secureFetch from '../libs/secureFetch';

import { logOut } from './auth';
import { setRoute } from './route';

export const setSingleApp = app => ({
  type: SET_SINGLE_APP,
  app,
});

export const setSingleIsFailed = isFailed => ({
  type: SET_SINGLE_IS_FAILED,
  isFailed,
});

export const fetchSingleApp = id => (dispatch, getState) => {
  const { auth } = getState();

  dispatch(setSingleIsFailed(false));

  secureFetch(`/api/apps/${id}`, auth.get('token'))
    .then(response => response.json())
    .then(({ app }) => {
      dispatch(setSingleApp(Immutable.fromJS(app)));
    })
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch(logOut());
        return;
      }

      if (err.message === 'Not Found') {
        dispatch(setRoute('home'));
        return;
      }

      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */

      dispatch(setSingleIsFailed(true));
    });
};
