const getServerUrl = (path) => {
  const endpoint = 'https://getwebcatalog.com';

  return `${endpoint}${path}`;
};

export default getServerUrl;
