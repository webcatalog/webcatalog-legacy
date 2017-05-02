const getServerUrl = (path) => {
  const endpoint = 'https://webcatalog-server.herokuapp.com';

  return `${endpoint}${path}`;
};

module.exports = getServerUrl;
