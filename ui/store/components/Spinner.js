import React from 'react';

const Spinner = () => (
  <div
    style={{
      width: '100%',
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
    }}
  >
    <div className="pt-spinner pt-small">
      <div className="pt-spinner-svg-container">
        <svg viewBox="0 0 100 100">
          <path
            className="pt-spinner-track"
            d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"
          />
          <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5" />
        </svg>
      </div>
    </div>
  </div>
);

export default Spinner;
