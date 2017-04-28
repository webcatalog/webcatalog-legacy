import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Menu, MenuItem, Popover, Button, Position } from '@blueprintjs/core';

import { fetchApps } from '../actions/home';
import { LOADING, FAILED } from '../constants/statuses';
import categories from '../constants/categories';

import Loading from './Loading';
import NoConnection from './NoConnection';
import Card from './Card';

class Home extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        requestFetchApps();
      }
    };
  }

  componentWillUnmount() {
    this.scrollContainer.onscroll = null;
  }

  renderList() {
    const { apps } = this.props;

    // Show apps if available
    if (apps) {
      return (
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {apps.map(app => <Card app={app} key={app.get('id')} />)}
        </div>
      );
    }

    return null;
  }

  renderStatus() {
    const {
      status, requestFetchApps,
    } = this.props;
    if (status === LOADING) return <Loading />;
    if (status === FAILED) return <NoConnection handleClick={() => requestFetchApps()} />;

    return null;
  }

  render() {
    return (
      <div
        style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}
        ref={(container) => { this.scrollContainer = container; }}
      >
        <div style={{ width: '100%', maxWidth: 960, margin: '0px auto 6px', display: 'flex', justifyContent: 'space-between', padding: '0 6px' }}>
          <Popover
            content={(
              <Menu>
                {categories.map(category => (
                  <MenuItem
                    key={category}
                    text={category}
                  />
                ))}
              </Menu>
            )}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              rightIconName="chevron-down"
              text="All Categories"
            />
          </Popover>
          <Popover
            content={(
              <Menu>
                <MenuItem
                  text="Most Downloaded"
                />
                <MenuItem
                  text="A to Z"
                />
                <MenuItem
                  text="Recently Added"
                />
              </Menu>
            )}
            position={Position.BOTTOM_RIGHT}
          >
            <Button
              rightIconName="chevron-down"
              text="Most Downloaded"
            />
          </Popover>
        </div>
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

Home.propTypes = {
  status: PropTypes.string.isRequired,
  apps: PropTypes.instanceOf(Immutable.List).isRequired,
  requestFetchApps: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  status: state.home.get('status'),
  apps: state.home.get('apps'),
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Home);
