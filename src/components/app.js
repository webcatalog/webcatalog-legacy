import React from 'react';

import AppArgv from './app-argv';
import AppNoArgv from './app-no-argv';

const App = () => {
  if (window.shellInfo.name) {
    return <AppArgv />;
  }

  return <AppNoArgv />;
};

export default App;
