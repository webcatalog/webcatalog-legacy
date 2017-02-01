import React from 'react';
import { connect } from 'react-redux';
import { Button, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

const Nav = ({
  isLoading,
  onBackButtonClick,
  onForwardButtonClick,
  onRefreshButtonClick,
}) => (
  <nav
    className="pt-navbar pt-tiny"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
      flexBasis: 22,
      height: 22,
      paddingLeft: 80,
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1 }}>
      <Button
        iconName="chevron-left"
        className={classNames(
          Classes.MINIMAL,
          Classes.DISABLED,
        )}
        onClick={onBackButtonClick}
      />
      <Button
        iconName="chevron-right"
        className={classNames(
          Classes.MINIMAL,
        )}
        onClick={onForwardButtonClick}
      />
      <Button
        iconName="repeat"
        className={classNames(
          Classes.MINIMAL,
        )}
        onClick={onRefreshButtonClick}
      />
    </div>
    <div className="pt-navbar-group pt-align-right">
      {isLoading ? (
        <div className="pt-spinner">
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
      ) : null}
    </div>
  </nav>
);

Nav.propTypes = {
  isLoading: React.PropTypes.bool,
  onBackButtonClick: React.PropTypes.func,
  onForwardButtonClick: React.PropTypes.func,
  onRefreshButtonClick: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isLoading: state.nav.isLoading,
});

export default connect(
  mapStateToProps,
)(Nav);
