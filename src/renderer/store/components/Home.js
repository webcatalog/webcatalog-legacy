import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Menu, MenuItem, Popover, Button, Position } from '@blueprintjs/core';

import { fetchApps, setCategory, setSort } from '../actions/home';
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
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto', zIndex: 1 }}>
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
    const { category, sort, requestSetCategory, requestSetSort } = this.props;

    return (
      <div
        style={{ flex: 1, overflow: 'auto', paddingBottom: 12, zIndex: 2 }}
        ref={(container) => { this.scrollContainer = container; }}
      >
        <div style={{ width: '100%', position: 'fixed', backgroundColor: '#D8E1E8', height: 42, padding: '6px 18px', zIndex: 3 }}>
          <div style={{ width: '100%', maxWidth: 960, margin: '0px auto 6px', display: 'flex', justifyContent: 'space-between', padding: '0 6px' }}>
            <Popover
              content={(
                <Menu>
                  <MenuItem
                    key="all"
                    text="All Categories"
                    onClick={() => requestSetCategory(null)}
                  />
                  {categories.map(c => (
                    <MenuItem
                      className="category-text"
                      key={c}
                      text={c.replace('+', ' & ')}
                      onClick={() => requestSetCategory(c)}
                    />
                  ))}
                </Menu>
              )}
              position={Position.BOTTOM_LEFT}
            >
              <Button
                rightIconName="chevron-down"
                className="category-text"
                text={category ? category.replace('+', ' & ') : 'All Categories'}
              />
            </Popover>
            <Popover
              content={(
                <Menu>
                  <MenuItem
                    text="Most Downloaded"
                    onClick={() => requestSetSort('installCount')}
                  />
                  <MenuItem
                    text="Name"
                    onClick={() => requestSetSort('name')}
                  />
                  <MenuItem
                    text="Recently Added"
                    onClick={() => requestSetSort('createdAt')}
                  />
                </Menu>
              )}
              position={Position.BOTTOM_RIGHT}
            >
              <p>
                <span>Sort by: </span>
                <Button
                  rightIconName="chevron-down"
                  text={(() => {
                    switch (sort) {
                      case 'name':
                        return 'Name';
                      case 'createdAt':
                        return 'Recently Added';
                      default:
                        return 'Most Downloaded';
                    }
                  })()}
                />
              </p>
            </Popover>
          </div>
        </div>
        <div
          className="pt-card"
          style={{ maxWidth: 960, margin: '48px auto 0', textAlign: 'center', padding: 10 }}
        >
          <span>Cannot find your favorite app?&#32;</span>
          <a onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/submit')}>
            <span className="pt-icon-standard pt-icon-add" />
            <span>&#32;Submit new app</span>
          </a>.
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
  category: PropTypes.string,
  sort: PropTypes.string,
  requestFetchApps: PropTypes.func.isRequired,
  requestSetCategory: PropTypes.func.isRequired,
  requestSetSort: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  status: state.home.get('status'),
  apps: state.home.get('apps'),
  category: state.home.get('category'),
  sort: state.home.get('sort'),
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => dispatch(fetchApps()),
  requestSetCategory: category => dispatch(setCategory(category)),
  requestSetSort: sort => dispatch(setSort(sort)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Home);
