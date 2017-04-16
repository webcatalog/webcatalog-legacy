import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';

const Loading = () => (
  <div
    style={{
      width: '100%',
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
    }}
  >
    <Spinner className={Classes.SMALL} />
  </div>
);

export default Loading;
