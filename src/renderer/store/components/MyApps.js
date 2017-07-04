import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState, Button, Classes, Intent } from '@blueprintjs/core';
import classNames from 'classnames';

import { LOADING, FAILED, DONE } from '../constants/statuses';

import Card from './Card';
import Loading from './Loading';
import NoConnection from './NoConnection';

import { removeMyAppsResults, fetchMyApps } from '../actions/myApps';
import { setRoute } from '../actions/route';
import { logOut } from '../actions/auth';

class MyApps extends React.Component {
  componentDidMount() {
    const { requestFetchMyApps, requestResetMyApps } = this.props;

    requestResetMyApps();
    requestFetchMyApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        requestFetchMyApps();
      }
    };
  }

  componentWillUnmount() {
    this.scrollContainer.onscroll = null;
  }

  renderStatus() {
    const {
      status, requestFetchMyApps,
    } = this.props;
    if (status === LOADING) return <Loading />;
    if (status === FAILED) return <NoConnection handleClick={() => requestFetchMyApps()} />;

    return null;
  }

  renderList() {
    const {
      status, myApps,
    } = this.props;

    if (status === DONE && myApps.size < 1) {
      return (
        <NonIdealState
          visual="import"
          title="You haven't installed any apps."
          description="Your installed apps will show up here."
        />
      );
    }

    return (
      <div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {myApps.map(o => <Card app={o} key={o.get('id')} />)}
        </div>
      </div>
    );
  }

  render() {
    const { signedIn, goTo, handleSignInClick } = this.props;

    return (
      <div
        style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}
        ref={(container) => { this.scrollContainer = container; }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            className={classNames(
              Classes.MINIMAL,
            )}
            text="Installed Apps"
            onClick={() => goTo('installed')}
          />
          <Button
            className={classNames(
              Classes.ACTIVE,
              Classes.MINIMAL,
            )}
            text="My Apps"
            onClick={() => goTo('my')}
          />
        </div>
        {signedIn ? [
          <div key="list">{this.renderList()}</div>,
          <div key="status">{this.renderStatus()}</div>,
        ] : (
          <NonIdealState
            visual="error"
            className="no-connection"
            title="You need to sign in."
            description="Please sign in and try again."
            action={(
              <Button
                iconName="log-in"
                intent={Intent.PRIMARY}
                className={Classes.LARGE}
                text="Sign in"
                onClick={handleSignInClick}
              />
            )}
          />
        )}
      </div>
    );
  }
}

MyApps.propTypes = {
  myApps: PropTypes.instanceOf(Immutable.List).isRequired,
  status: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  requestFetchMyApps: PropTypes.func.isRequired,
  requestResetMyApps: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  handleSignInClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myApps: state.myApps.get('apps'),
  status: state.myApps.get('status'),
  signedIn: Boolean(state.auth.get('token') && state.auth.get('token') !== 'anonnymous'),
});

const mapDispatchToProps = dispatch => ({
  requestResetMyApps: () => dispatch(removeMyAppsResults()),
  requestFetchMyApps: () => dispatch(fetchMyApps()),
  goTo: routeId => dispatch(setRoute(routeId)),
  handleSignInClick: () => dispatch(logOut()),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(MyApps);
