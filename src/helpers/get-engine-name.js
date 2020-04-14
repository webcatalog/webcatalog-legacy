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
    case 'chrome': {
      return 'Google Chrome';
    }
    case 'chromeCanary': {
      return 'Google Chrome Canary';
    }
    case 'brave': {
      return 'Brave';
    }
    case 'vivaldi': {
      return 'Vivaldi';
    }
    case 'edge': {
      return 'Microsoft Edge';
    }
    default: {
      throw new Error('Engine is not supported');
    }
  }
};

export default getEngineName;
