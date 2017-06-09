import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import {
  addTab,
  setActiveTab,
} from '../actions/tabs';

const LeftNav = ({
  tabs,
  requestAddTab,
  requestSetActiveTab,
}) => (
  <div
    style={{
      width: 64,
      backgroundColor: '#293742',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      overflowY: 'auto',
    }}
  >
    {tabs.map((tab, tabIndex) => (
      <div
        key={tab.hashCode()}
        style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            height: 42,
            width: 42,
            borderRadius: 21,
            backgroundColor: tab.get('isActive') ? '#5C7080' : '#fff',
            color: tab.get('isActive') ? '#fff' : '#182026',
            margin: '0 auto',
            fontSize: 30,
            lineHeight: '42px',
            textAlign: 'center',
            userSelect: 'none',
            cursor: 'default',
          }}
          onClick={() => requestSetActiveTab(tabIndex)}
        >
          {tabIndex + 1}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#fff',
          }}
        >
          ⌘{tabIndex + 1}
        </div>
      </div>
    ))}
    {tabs.size < 9 ? (
      <div
        style={{
          height: 42,
          width: 42,
          borderRadius: 21,
          backgroundColor: '#fff',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <span
          className="pt-icon-large pt-icon-plus"
          style={{
            fontSize: 30,
            lineHeight: '42px',
          }}
          onClick={() => requestAddTab()}
        />
      </div>
    ) : null}
  </div>
);

LeftNav.propTypes = {
  tabs: PropTypes.instanceOf(Immutable.List),
  requestAddTab: PropTypes.func.isRequired,
  requestSetActiveTab: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tabs: state.tabs.get('list'),
});

const mapDispatchToProps = dispatch => ({
  requestAddTab: () => dispatch(addTab()),
  requestSetActiveTab: isActive => dispatch(setActiveTab(isActive)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(LeftNav);
