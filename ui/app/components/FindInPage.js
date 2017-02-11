import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';

import { toggleFindInPageDialog, updateFindInPageText } from '../actions/findInPage';

class FindInPage extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    const {
      activeMatch, matches, text,
      onRequestFind, onRequestStopFind, onRequestClose, onRequestUpdateText,
    } = this.props;

    return (
      <nav
        className="pt-navbar"
      >
        <div className="pt-navbar-group pt-align-right">
          <div
            style={{ marginRight: 5 }}
          >
            {activeMatch} / {matches} matches
          </div>
          <input
            ref={(input) => { this.input = input; }}
            className="pt-input"
            placeholder="Search"
            type="text"
            value={text}
            style={{ marginRight: 5 }}
            onChange={(e) => {
              const val = e.target.value;
              onRequestUpdateText(val);
              if (val.length > 0) {
                onRequestFind(val, true);
              } else {
                onRequestStopFind();
              }
            }}
            onInput={(e) => {
              const val = e.target.value;
              onRequestUpdateText(val);
              if (val.length > 0) {
                onRequestFind(val, true);
              } else {
                onRequestStopFind();
              }
            }}
            onKeyDown={(e) => {
              if ((e.keyCode || e.which) === 13) {
                const val = e.target.value;
                if (val.length > 0) {
                  onRequestFind(val, true);
                }
              }
            }}
          />
          <Button
            iconName="chevron-up"
            style={{ marginRight: 5 }}
            onClick={() => {
              if (text.length > 0) {
                onRequestFind(text, false);
              }
            }}
          />
          <Button
            iconName="chevron-down"
            style={{ marginRight: 5 }}
            onClick={() => {
              if (text.length > 0) {
                onRequestFind(text, true);
              }
            }}
          />
          <Button
            iconName="cross"
            style={{ marginRight: 5 }}
            onClick={() => {
              onRequestStopFind();
              onRequestClose();
            }}
          />
        </div>
      </nav>
    );
  }
}

FindInPage.propTypes = {
  text: React.PropTypes.string,
  activeMatch: React.PropTypes.number,
  matches: React.PropTypes.number,
  onRequestFind: React.PropTypes.func,
  onRequestStopFind: React.PropTypes.func,
  onRequestClose: React.PropTypes.func,
  onRequestUpdateText: React.PropTypes.func,
};

const mapStateToProps = state => ({
  activeMatch: state.findInPage.activeMatch,
  matches: state.findInPage.matches,
  text: state.findInPage.text,
});

const mapDispatchToProps = dispatch => ({
  onRequestClose: () => {
    dispatch(toggleFindInPageDialog());
  },
  onRequestUpdateText: (text) => {
    dispatch(updateFindInPageText(text));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(FindInPage);
