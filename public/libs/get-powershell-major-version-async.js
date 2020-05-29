// https://stackoverflow.com/questions/1825585/determine-installed-powershell-version
const execAsync = require('./exec-async');

const getPowershellMajorVersionAsync = () => execAsync('powershell "$PSVersionTable.PSVersion.Major"')
  .then((majorVersionString) => parseInt(majorVersionString, 10))
  .catch(() => 0);

module.exports = getPowershellMajorVersionAsync;
