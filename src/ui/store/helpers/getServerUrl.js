/* global fetch */

const getServerUrl = (path) => {
  let endpoint = 'https://webcatalog-server.herokuapp.com';
  if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
  }

  return `${endpoint}${path}`;
};

export default getServerUrl;
