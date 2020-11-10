/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fetch = process.env.NODE_ENV === 'production' ? require('node-fetch').default : require('node-fetch');
const ProxyAgent = require('proxy-agent');

// somehow, ELECTRON_RUN_AS_NODE is set to '1' instead of 'true' as specified
// so use generic process.env.ELECTRON_RUN_AS_NODE condition instead of
// something like process.env.ELECTRON_RUN_AS_NODE === 'true'
const { getPreference } = process.env.ELECTRON_RUN_AS_NODE ? {} : require('./preferences');

const customizedFetch = (url, _opts, ...args) => {
  let proxyPacScript = process.env.PROXY_PAC_SCRIPT;
  let proxyRules = process.env.PROXY_RULES;
  let proxyType = process.env.PROXY_TYPE;
  if (getPreference) {
    proxyPacScript = getPreference('proxyPacScript');
    proxyRules = getPreference('proxyRules');
    proxyType = getPreference('proxyType');
  }

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
