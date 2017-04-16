import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Classes } from '@blueprintjs/core';

const NoConnection = ({ handleClick }) => (
  <div className="text-container">
    <h5>WebCatalog could not connect to its server. </h5>
    <h6>Please check your Internet connection and try again.</h6>
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
  handleClick: PropTypes.func,
};

export default NoConnection;
