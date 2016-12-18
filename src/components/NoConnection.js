import React from 'react';

const NoConnection = ({ handleClick }) => (
  <div className="text-container">
    <h5>
      WebCatalog could not connect to its server.
      Please check your Internet connection and try again.
    </h5>
    <button
      type="button"
      className="pt-button pt-large pt-intent-primary pt-icon-repeat"
      onClick={handleClick}
    >
      Try again
    </button>
  </div>
);

NoConnection.propTypes = {
  handleClick: React.PropTypes.func,
};

export default NoConnection;
