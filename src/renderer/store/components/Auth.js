import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

/* esint-disabled */

const Auth = () => (
  <div style={{ flex: 1, WebkitUserSelect: 'none', WebkitAppRegion: 'drag', textAlign: 'center' }}>
    <NonIdealState
      visual={<img src="images/logo.png" alt="WebCatalog" style={{ height: 64 }} />}
      title="Sign in to Continue"
      description="We do not sell or share your information with anyone else."
      action={[
        <button
          key="local"
          type="button"
          className="pt-button pt-large"
          style={{ width: 250, display: 'block', margin: '15px auto 0 auto' }}
          onClick={() => ipcRenderer.send('sign-in', '')}
        >
          <span
            className="pt-icon-standard pt-icon-lock"
            style={{
              float: 'left',
              fontSize: 20,
              fill: '#fff',
              marginTop: 10,
              marginRight: 10,
            }}
          />
          Continue with Email
        </button>,
        <button
          key="google"
          type="button"
          className="pt-button pt-intent-danger pt-large"
          style={{ width: 250, display: 'block', backgroundColor: '#4285F4', margin: '10px auto 0 auto' }}
          onClick={() => ipcRenderer.send('sign-in', 'google')}
        >
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.414"
            style={{
              float: 'left',
              height: 20,
              fill: '#fff',
              marginTop: 10,
              marginRight: 10,
            }}
          >
            <path d="M8.16 6.857V9.6h4.537c-.183 1.177-1.37 3.45-4.537 3.45-2.73 0-4.96-2.26-4.96-5.05s2.23-5.05 4.96-5.05c1.554 0 2.594.66 3.19 1.233l2.17-2.092C12.126.79 10.32 0 8.16 0c-4.423 0-8 3.577-8 8s3.577 8 8 8c4.617 0 7.68-3.246 7.68-7.817 0-.526-.057-.926-.126-1.326H8.16z" />
          </svg>
          Continue with Google
        </button>,
      ]}
    />
  </div>
);

export default Auth;
