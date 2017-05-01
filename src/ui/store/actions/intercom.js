import { logOut } from './auth';
import secureFetch from '../helpers/secureFetch';

export const updateIntercomUser = token => dispatch =>
  secureFetch('/api/user', token)
  .then(response => response.json())
  .then(({ user }) => {
    window.Intercom('update', {
      email: user.email,
      user_id: user.id,
      user_hash: user.intercomUserHash,
    });
    window.Intercom('boot');
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

export const bootIntercom = () => (dispatch, getState) => {
  const { auth } = getState();

  window.Intercom('boot', {
    app_id: 'rzjr1fun',
  });

  if (auth.get('token')) {
    dispatch((updateIntercomUser(auth.get('token'))));
  }
};

export const shutdownIntercom = () => () => window.Intercom('shutdown');
