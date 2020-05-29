// https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed
const regedit = require('regedit');

const getNetFrameworkVersionAsync = () => new Promise((resolve) => {
  const regeditPath = 'HKLM\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP\\v4\\Full';
  regedit.list(regeditPath, (err, result) => {
    if (err) {
      resolve(0);
      return;
    }

    try {
      const v = result[regeditPath].values.Release.value;
      resolve(v);
    } catch (catchedErr) {
      resolve(0);
    }
  });
});

module.exports = getNetFrameworkVersionAsync;
