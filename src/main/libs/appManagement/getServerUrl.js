const getServerUrl = (path) => {
  const endpoint = 'https://webcatalog.io';

  return `${endpoint}${path}`;
};

module.exports = getServerUrl;
