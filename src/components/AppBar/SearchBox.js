import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import Slide from 'material-ui/transitions/Slide';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import FakeTitleBar from '../shared/FakeTitleBar';

import {
  openSearchBox,
  closeSearchBox,
  formUpdate,
} from '../../state/ui/searchBox/actions';

const styleSheet = createStyleSheet('SearchBox', {
  appBarContainer: {
    width: '100%',
  },
  toolbar: {
    padding: '0 12px',
  },
  appBar: {
    zIndex: 1,
  },
  searchBarText: {
    lineHeight: 1.5,
    padding: '0 16px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'normal',
    fontSize: 21,
  },
  searchBar: {
    boxShadow: 'none',
    position: 'absolute',
    zIndex: 2,
  },
  searchAppBarOpen: {
    marginTop: -44,
    paddingTop: 22,
  },
  searchAppBar: {
    marginTop: -44,
    boxShadow: 'none',
    paddingTop: 24,
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: grey[400],
    },
  },
});

class SearchBox extends React.Component {
  constructor() {
    super();

    this.handleToggleSearchBox = this.handleToggleSearchBox.bind(this);
  }

  componentDidUpdate() {
    const {
      open,
    } = this.props;

    if (open) {
      this.inputBox.focus();
    }
  }

  handleToggleSearchBox() {
    const {
      open,
      onOpenSearchBox,
      onCloseSearchBox,
    } = this.props;

    if (open) {
      onCloseSearchBox();
    } else {
      onOpenSearchBox();
    }
  }

  render() {
    const {
      classes,
      open,
      query,
      onFormUpdate,
    } = this.props;

    return (
      <Slide in={open} className={classes.searchBar}>
        <div
          className={classes.appBarContainer}
          ref={(appBar) => { this.appBar = appBar; }}
        >
          <FakeTitleBar isColorDisabled />
          <AppBar
            color="default"
            position="static"
            key="searchBar"
            className={open ? classes.searchAppBarOpen : classes.searchAppBar}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="default"
                aria-label="Menu"
                onClick={() => this.handleToggleSearchBox()}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                className={classes.searchBarText}
                color="inherit"
                type="title"
              >
                <input
                  value={query}
                  placeholder="Search apps"
                  className={classes.input}
                  ref={(inputBox) => { this.inputBox = inputBox; }}
                  onInput={e => onFormUpdate({ query: e.target.value })}
                  onChange={e => onFormUpdate({ query: e.target.value })}
                />
              </Typography>
              <IconButton
                color="default"
                aria-label="Close"
                onClick={() => this.handleToggleSearchBox()}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      </Slide>
    );
  }
}

SearchBox.defaultProps = {
  query: '',
};

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  query: PropTypes.string,
  onOpenSearchBox: PropTypes.func.isRequired,
  onCloseSearchBox: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.ui.searchBox.open,
  query: state.ui.searchBox.form.query,
});

const mapDispatchToProps = dispatch => ({
  onOpenSearchBox: () => dispatch(openSearchBox()),
  onCloseSearchBox: () => dispatch(closeSearchBox()),
  onFormUpdate: changes => dispatch(formUpdate(changes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SearchBox));
