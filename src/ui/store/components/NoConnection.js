import React from 'react';
import { Button, Intent, Classes } from '@blueprintjs/core';

const NoConnection = ({ handleClick }) => (
  <div className="text-container">
    <h5>
      WebCatalog could not connect to its server.
      Please check your Internet connection and try again.
    </h5>
    <Button
      iconName="repeat"
      intent={Intent.PRIMARY}
      className={Classes.LARGE}
      text="Try Again"
      onClick={handleClick}
    />
  </div>
);

NoConnection.propTypes = {
  handleClick: React.PropTypes.func,
};

export default NoConnection;
