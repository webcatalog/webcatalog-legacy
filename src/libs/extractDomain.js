const extractDomain = (url) => {
  try {
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    const domain = matches && matches[1];
    return domain.replace('www.', '');
  } catch (err) {
    return null;
  }
};

export default extractDomain;
