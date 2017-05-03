const getServerUrl = (path) => {
  const endpoint = 'https://getwebcatalog.com';

  return `${endpoint}${path}`;
};

module.exports = getServerUrl;
