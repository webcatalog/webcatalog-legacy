// https://stackoverflow.com/questions/21457548/why-put-ref-in-url
const generateUrlWithRef = (url) => {
  if (!url) return null;
  const urlObj = new URL(url);
  urlObj.searchParams.append('ref', 'webcatalog.app');
  return urlObj.toString();
};

export default generateUrlWithRef;
