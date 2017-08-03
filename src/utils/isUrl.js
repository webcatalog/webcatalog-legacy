const isUrl = (url) => {
  // eslint-disable-next-line
  const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return re.test(url);
};

export default isUrl;
