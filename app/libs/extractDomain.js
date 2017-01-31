const extractDomain = (fullUrl) => {
  const matches = fullUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain ? domain.replace('www.', '') : null;
};

module.exports = extractDomain;
