import getServerUrl from './getServerUrl';
import customFetch from '../../shared/libs/customFetch';

const secureFetch = (path, token) => {
  const request = new window.Request(
    getServerUrl(path),
    {
      headers: token !== 'anonnymous' ? new window.Headers({
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
      }) : new window.Headers({}),
    },
  );

  return customFetch(request);
};

export default secureFetch;
