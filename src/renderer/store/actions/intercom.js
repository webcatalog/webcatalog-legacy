import { logOut } from './auth';
import secureFetch from '../libs/secureFetch';

export const bootIntercom = () => (dispatch, getState) => {
  const { auth } = getState();

  if (auth.get('token')) {
    secureFetch('/api/user', auth.get('token'))
    .then(response => response.json())
    .then(({ user }) => {
      window.Intercom('boot', {
        app_id: 'rzjr1fun',
        email: user.email,
        user_id: user.id,
        user_hash: user.intercomUserHash,
        signed_up_at: Math.floor(new Date(user.createdAt).getTime() / 1000),
      });
    })
    .catch((err) => {
      if (err && err.response && err.response.status === 401) {
        dispatch(logOut());
        return;
      }

      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    });
  }
};

export const shutdownIntercom = () => () => window.Intercom('shutdown');
