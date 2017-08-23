const getServerUrl = (path) => {
  const endpoint = 'https://webcatalog.io';

  return `${endpoint}${path}`;
};

export default getServerUrl;
