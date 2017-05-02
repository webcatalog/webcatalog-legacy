import React from 'react';
import PropTypes from 'prop-types';
import { NonIdealState, Button, Intent, Classes } from '@blueprintjs/core';

const NoConnection = ({ handleClick }) => (
  <NonIdealState
    visual="error"
    className="no-connection"
    title="Internet Connection"
    description="Please check your Internet connection and try again."
    action={(
      <Button
        iconName="repeat"
        intent={Intent.PRIMARY}
        className={Classes.LARGE}
        text="Try Again"
        onClick={handleClick}
      />
    )}
  />
);

NoConnection.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default NoConnection;
