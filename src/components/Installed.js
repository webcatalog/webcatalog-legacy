/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchInstalled } from '../actions/installed';
import { LOADING, FAILED, DONE } from '../constants/actions';

import Spinner from './Spinner';
import NoConnection from './NoConnection';
import Card from './Card';

class App extends React.Component {
  componentDidMount() {
    const { requestInstalled } = this.props;
    requestInstalled();
  }

  renderList() {
    const {
      status, hits,
    } = this.props;

    if (status === DONE) {
      if (hits.size < 1) {
        return (
          <div className="text-container">
            <h5>You have not installed any apps.</h5>
          </div>
        );
      }
      return (
        <div>
          <div className="text-container">
            <h5>Installed applications</h5>
          </div>
          <div className="grid">
            {hits.map(app => <Card app={app} key={app.get('id')} />)}
          </div>
          <div className="text-container">
            <p>powered by</p>
            <p>
              <a onClick={() => shell.openExternal('https://www.algolia.com')}>
                <img
                  src="images/Algolia_logo_bg-white.svg"
                  role="presentation"
                  style={{ height: 32 }}
                />
              </a>
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  renderStatus() {
    const {
      status,
      requestInstalled,
    } = this.props;

    if (status === LOADING) return <Spinner />;
    if (status === FAILED) return <NoConnection handleClick={() => requestInstalled()} />;

    return null;
  }

  render() {
    return (
      <div>
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

App.propTypes = {
  status: React.PropTypes.string,
  hits: React.PropTypes.instanceOf(Immutable.List),
  requestInstalled: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.installed.status,
  hits: state.installed.hits,
});

const mapDispatchToProps = dispatch => ({
  requestInstalled: () => {
    dispatch(fetchInstalled());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
