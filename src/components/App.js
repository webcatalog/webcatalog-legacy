/* global shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps } from '../actions';

const extractDomain = (url) => {
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain.replace('www.', '');
};

class App extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();
  }

  render() {
    const { status, apps } = this.props;

    if (status === 'loading') return (<div>loading</div>);

    return (
      <div className="container">
        <div className="pt-input-group pt-large">
          <span className="pt-icon pt-icon-search" />
          <input type="text" className="pt-input" placeholder="Search (name, URL)..." />
          <button className="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right" />
        </div>
        <div className="grid">
          {apps.map(app => (
            <div className="col">
              <div className="pt-card pt-elevation-1" style={{ textAlign: 'center' }}>
                <img className="logo" src={`https://backend.getwebcatalog.com/images/${app.get('id')}@128px.webp`} role="presentation" />
                <h5>{app.get('name')}</h5>
                <p>
                  <a onClick={() => shell.openExternal(app.get('url'))}>
                    {extractDomain(app.get('url'))}
                  </a>
                </p>
                <a
                  role="button"
                  className="pt-button pt-intent-primary pt-icon-download"
                  tabIndex="0"
                >
                  Install
                </a>
                <a
                  role="button"
                  className="pt-button"
                  tabIndex="0"
                  style={{ marginLeft: 6 }}
                >
                  Try
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  status: React.PropTypes.string,
  apps: React.PropTypes.instanceOf(Immutable.Map),
  requestFetchApps: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
