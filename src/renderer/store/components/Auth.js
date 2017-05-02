import React from 'react';
import { NonIdealState, Button, Intent, Classes } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';


const Auth = () => (
  <div style={{ flex: 1, WebkitUserSelect: 'none', WebkitAppRegion: 'drag' }}>
    <NonIdealState
      visual={<img src="images/logo.png" alt="WebCatalog" className="logo" />}
      title="Sign in to Continue"
      description="We do not sell or share your information with anyone else."
      action={(
        <Button
          iconName="log-in"
          intent={Intent.DANGER}
          className={Classes.LARGE}
          text="Sign in with Google"
          onClick={() => ipcRenderer.send('sign-in')}
          style={{ WebkitAppRegion: 'no-drag' }}
        />
      )}
    />
  </div>
);

export default Auth;
