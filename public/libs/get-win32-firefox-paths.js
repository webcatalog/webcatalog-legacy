// https://github.com/GoogleChrome/chrome-launcher/blob/master/src/chrome-finder.ts

const fs = require('fs-extra');
const path = require('path');

const canAccess = (file) => {
  if (!file) {
    return false;
  }

  try {
    fs.accessSync(file);
    return true;
  } catch (e) {
    return false;
  }
};

const getWin32FirefoxPaths = () => {
  const installations = [];
  const suffixes = [
    `${path.sep}Mozilla Firefox${path.sep}firefox.exe`,
  ];
  const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']].filter(Boolean);

  prefixes.forEach((prefix) => suffixes.forEach((suffix) => {
    const firefoxPath = path.join(prefix, suffix);
    if (canAccess(firefoxPath)) {
      installations.push(firefoxPath);
    }
  }));

  return installations;
};

module.exports = getWin32FirefoxPaths;
