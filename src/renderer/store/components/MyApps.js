import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState, Button, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import { LOADING, FAILED, DONE } from '../constants/statuses';

import Card from './Card';
import Loading from './Loading';
import NoConnection from './NoConnection';

import { fetchMyApps } from '../actions/myApps';
import { setRoute } from '../actions/route';

class MyApps extends React.Component {
  componentDidMount() {
    const { requestFetchMyApps } = this.props;

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
    const { status, myApps, goTo } = this.props;

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
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {myApps.map(o => <Card app={o} key={o.get('id')} />)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

MyApps.propTypes = {
  myApps: PropTypes.instanceOf(Immutable.List).isRequired,
  status: PropTypes.string.isRequired,
  requestFetchMyApps: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myApps: state.myApps.get('apps'),
  status: state.myApps.get('status'),
});

const mapDispatchToProps = dispatch => ({
  requestFetchMyApps: () => dispatch(fetchMyApps()),
  goTo: routeId => dispatch(setRoute(routeId)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(MyApps);
