import getServerUrl from './getServerUrl';
import customFetch from '../../shared/libs/customFetch';

const secureFetch = (path, token) => {
  const request = new window.Request(
    getServerUrl(path),
    {
      headers: new window.Headers({
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
      }),
    },
  );

  return customFetch(request);
};

export default secureFetch;
