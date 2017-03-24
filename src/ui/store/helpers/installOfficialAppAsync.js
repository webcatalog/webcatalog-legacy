import downloadIconAsync from './downloadIconAsync';
import installAppAsync from './installAppAsync';

const installOfficialAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  downloadIconAsync(appId)
    .then(pngPath => installAppAsync({ allAppPath, appId, appName, appUrl, pngPath }));

export default installOfficialAppAsync;
