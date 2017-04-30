/* global fetch */

const getServerUrl = (path) => {
  const endpoint = 'https://webcatalog-server.herokuapp.com';

  return `${endpoint}${path}`;
};

export default getServerUrl;
