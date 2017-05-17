import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';

/* esint-disabled */

const Auth = () => (
  <div style={{ flex: 1, WebkitUserSelect: 'none', WebkitAppRegion: 'drag' }}>
    <NonIdealState
      visual={<img src="images/logo.png" alt="WebCatalog" style={{ height: 64 }} />}
      title="Sign in to Continue"
      description="We do not sell or share your information with anyone else."
      action={[
        <button
          key="google"
          type="button"
          className="pt-button pt-intent-danger pt-large"
          style={{ width: 250, display: 'block', backgroundColor: '#dd4b39', marginTop: 15 }}
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
          Sign in with Google
        </button>,
        <button
          key="facebook"
          type="button"
          className="pt-button pt-intent-danger pt-large"
          style={{ width: 250, display: 'block', backgroundColor: '#3b5998', marginTop: 10 }}
          onClick={() => ipcRenderer.send('sign-in', 'facebook')}
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
            <path d="M15.117 0H.883C.395 0 0 .395 0 .883v14.234c0 .488.395.883.883.883h7.663V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.54h2.39l-.31 2.42h-2.08V16h4.077c.488 0 .883-.395.883-.883V.883C16 .395 15.605 0 15.117 0" fillRule="nonzero" />
          </svg>
          Sign in with Facebook
        </button>,
        <button
          key="twitter"
          type="button"
          className="pt-button pt-intent-danger pt-large"
          style={{ width: 250, display: 'block', backgroundColor: '#1da1f2', marginTop: 10 }}
          onClick={() => ipcRenderer.send('sign-in', 'twitter')}
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
            <path d="M16 3.038c-.59.26-1.22.437-1.885.517.677-.407 1.198-1.05 1.443-1.816-.634.37-1.337.64-2.085.79-.598-.64-1.45-1.04-2.396-1.04-1.812 0-3.282 1.47-3.282 3.28 0 .26.03.51.085.75-2.728-.13-5.147-1.44-6.766-3.42C.83 2.58.67 3.14.67 3.75c0 1.14.58 2.143 1.46 2.732-.538-.017-1.045-.165-1.487-.41v.04c0 1.59 1.13 2.918 2.633 3.22-.276.074-.566.114-.865.114-.21 0-.41-.02-.61-.058.42 1.304 1.63 2.253 3.07 2.28-1.12.88-2.54 1.404-4.07 1.404-.26 0-.52-.015-.78-.045 1.46.93 3.18 1.474 5.04 1.474 6.04 0 9.34-5 9.34-9.33 0-.14 0-.28-.01-.42.64-.46 1.2-1.04 1.64-1.7z" fillRule="nonzero" />
          </svg>
          Sign in with Twitter
        </button>,
      ]}
    />
  </div>
);

export default Auth;
