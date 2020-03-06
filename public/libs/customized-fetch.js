const fetch = require('node-fetch');
const PacProxyAgent = require('pac-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

const { getPreference } = require('./preferences');

const customizedFetch = (url, _opts, ...args) => {
  const proxyPacScript = process.env.PROXY_PAC_SCRIPT || getPreference('proxyPacScript');
  const proxyRules = process.env.PROXY_RULES || getPreference('proxyRules');
  const proxyType = process.env.PROXY_TYPE || getPreference('proxyType');

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
