const getEngineName = (engine) => {
  switch (engine) {
    case 'electron': {
      return 'Electron';
    }
    case 'firefox': {
      return 'Mozilla Firefox';
    }
    case 'chromium': {
      return 'Chromium';
    }
    case 'chromium/tabs': {
      return 'Chromium (with tabs)';
    }
    case 'chrome': {
      return 'Google Chrome';
    }
    case 'chrome/tabs': {
      return 'Google Chrome (with tabs)';
    }
    case 'chromeCanary': {
      return 'Google Chrome Canary';
    }
    case 'chromeCanary/tabs': {
      return 'Google Chrome Canary (with tabs)';
    }
    case 'brave': {
      return 'Brave';
    }
    case 'brave/tabs': {
      return 'Brave (with tabs)';
    }
    case 'vivaldi': {
      return 'Vivaldi';
    }
    case 'vivaldi/tabs': {
      return 'Vivaldi (with tabs)';
    }
    case 'edge': {
      return 'Microsoft Edge';
    }
    case 'edge/tabs': {
      return 'Microsoft Edge (with tabs)';
    }
    case 'opera/tabs': {
      return 'Opera (with tabs)';
    }
    default: {
      throw new Error('Engine is not supported');
    }
  }
};

export default getEngineName;
