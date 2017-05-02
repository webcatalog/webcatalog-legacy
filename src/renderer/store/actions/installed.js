import Immutable from 'immutable';

import { SET_INSTALLED_APPS } from '../constants/actions';

import secureFetch from '../libs/secureFetch';

import { logOut } from './auth';

export const fetchInstalledApps = () => (dispatch, getState) => {
  const { appManagement, auth } = getState();

  Promise.resolve()
    .then(() => {
      const installedApps = appManagement.get('managedApps').toList().map(x => x.get('app'));

      dispatch({
        type: SET_INSTALLED_APPS,
        installedApps,
      });

      let requestPath = '/api/apps?sort=name&ids=';
      installedApps.forEach((app, i) => {
        requestPath += app.get('id');
        if (i < installedApps.size - 1) requestPath += ',';
      });

      return secureFetch(requestPath, auth.get('token'));
    })
    .then(response => response.json())
    .then(({ apps }) => {
      dispatch({
        type: SET_INSTALLED_APPS,
        installedApps: Immutable.fromJS(apps),
      });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        dispatch(logOut());
        return;
      }

      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    });
};
