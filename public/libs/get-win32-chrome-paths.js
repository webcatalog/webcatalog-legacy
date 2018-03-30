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

const getWin32ChromePaths = () => {
  const installations = [];
  const suffixes = [
    `${path.sep}Google${path.sep}Chrome SxS${path.sep}Application${path.sep}chrome.exe`,
    `${path.sep}Google${path.sep}Chrome${path.sep}Application${path.sep}chrome.exe`,
  ];
  const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']].filter(Boolean);

  prefixes.forEach(prefix => suffixes.forEach((suffix) => {
    const chromePath = path.join(prefix, suffix);
    if (canAccess(chromePath)) {
      installations.push(chromePath);
    }
  }));

  return installations;
};

module.exports = getWin32ChromePaths;
