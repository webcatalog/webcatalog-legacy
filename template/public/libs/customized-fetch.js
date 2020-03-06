const fetch = require('node-fetch');
const ProxyAgent = require('proxy-agent');

const { getPreference } = process.env.ELECTRON_RUN_AS_NODE === 'true' ? {} : require('./preferences');

const customizedFetch = (url, _opts, ...args) => {
  const proxyPacScript = process.env.PROXY_PAC_SCRIPT || getPreference('proxyPacScript');
  const proxyRules = process.env.PROXY_RULES || getPreference('proxyRules');
  const proxyType = process.env.PROXY_TYPE || getPreference('proxyType');

  const opts = { ..._opts };
  if (proxyType === 'rules') {
    const agent = new ProxyAgent(proxyRules);
    opts.agent = agent;
  } else if (proxyType === 'pacScript') {
    const agent = new ProxyAgent(`pac+${proxyPacScript}`);
    opts.agent = agent;
  }

  return fetch(url, opts, ...args);
};

module.exports = customizedFetch;
