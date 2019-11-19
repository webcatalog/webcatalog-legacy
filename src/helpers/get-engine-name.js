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
    case 'brave': {
      return 'Brave';
    }
    default: {
      throw new Error('Engine is not supported');
    }
  }
};

export default getEngineName;
