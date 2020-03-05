const fetch = require('node-fetch');
const PacProxyAgent = require('pac-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

const { getPreferences } = require('./preferences');

const customizedFetch = (url, _opts, ...args) => {
  const {
    proxyPacScript,
    proxyRules,
    proxyType,
  } = getPreferences();

  const opts = { ..._opts };
  if (proxyType === 'rules') {
    const agent = new HttpsProxyAgent(proxyRules);
    opts.agent = agent;
  } else if (proxyType === 'pacScript') {
    const agent = new PacProxyAgent(proxyPacScript);
    opts.agent = agent;
  }

  return fetch(url, opts, ...args);
};

module.exports = customizedFetch;
