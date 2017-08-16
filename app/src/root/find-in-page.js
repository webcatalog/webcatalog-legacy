import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import { toggleFindInPageDialog, updateFindInPageText } from '../state/root/find-in-page/actions';

class FindInPage extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    const {
      activeMatch, matches, text,
      onRequestFind, onRequestStopFind, onToggleFindInPageDialog, onUpdateFindInPageText,
    } = this.props;

    return (
      <div>
        <div>
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
            onUpdateFindInPageText(val);
            if (val.length > 0) {
              onRequestFind(val, true);
            } else {
              onRequestStopFind();
            }
          }}
          onInput={(e) => {
            const val = e.target.value;
            onUpdateFindInPageText(val);
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
        <button
          iconName="chevron-up"
          style={{ marginRight: 5 }}
          onClick={() => {
            if (text.length > 0) {
              onRequestFind(text, false);
            }
          }}
        />
        <button
          iconName="chevron-down"
          style={{ marginRight: 5 }}
          onClick={() => {
            if (text.length > 0) {
              onRequestFind(text, true);
            }
          }}
        />
        <button
          iconName="cross"
          style={{ marginRight: 5 }}
          onClick={() => {
            onRequestStopFind();
            onToggleFindInPageDialog();
          }}
        />
      </div>
    );
  }
}

FindInPage.propTypes = {
  text: PropTypes.string.isRequired,
  activeMatch: PropTypes.number.isRequired,
  matches: PropTypes.number.isRequired,
  onRequestFind: PropTypes.func.isRequired,
  onRequestStopFind: PropTypes.func.isRequired,
  onToggleFindInPageDialog: PropTypes.func.isRequired,
  onUpdateFindInPageText: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activeMatch: state.findInPage.activeMatch,
  matches: state.findInPage.matches,
  text: state.findInPage.text,
});

const actionCreators = {
  toggleFindInPageDialog,
  updateFindInPageText,
};

export default connectComponent(
  FindInPage,
  mapStateToProps,
  actionCreators,
);
