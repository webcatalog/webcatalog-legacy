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
      return 'Chromium (tabbed)';
    }
    case 'chrome': {
      return 'Google Chrome';
    }
    case 'chrome/tabs': {
      return 'Google Chrome (tabbed)';
    }
    case 'chromeCanary': {
      return 'Google Chrome Canary';
    }
    case 'chromeCanary/tabs': {
      return 'Google Chrome Canary (tabbed)';
    }
    case 'brave': {
      return 'Brave';
    }
    case 'brave/tabs': {
      return 'Brave (tabbed)';
    }
    case 'vivaldi': {
      return 'Vivaldi';
    }
    case 'vivaldi/tabs': {
      return 'Vivaldi (tabbed)';
    }
    case 'edge': {
      return 'Microsoft Edge';
    }
    case 'edge/tabs': {
      return 'Microsoft Edge (tabbed)';
    }
    case 'opera/tabs': {
      return 'Opera';
    }
    case 'yandex': {
      return 'Yandex Browser';
    }
    case 'yandex/tabs': {
      return 'Yandex Browser (tabbed)';
    }
    case 'coccoc': {
      return 'Cốc Cốc';
    }
    case 'coccoc/tabs': {
      return 'Cốc Cốc (tabbed)';
    }
    default: {
      return 'Unknown Engine';
    }
  }
};

export default getEngineName;
