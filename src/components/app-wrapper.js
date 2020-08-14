import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider as MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';

import connectComponent from '../helpers/connect-component';

import { updateIsFullScreen } from '../state/general/actions';

import App from './app';

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.handleEnterFullScreen = this.handleEnterFullScreen.bind(this);
    this.handleLeaveFullScreen = this.handleLeaveFullScreen.bind(this);
  }

  componentDidMount() {
    window.remote.getCurrentWindow().on('enter-full-screen', this.handleEnterFullScreen);
    window.remote.getCurrentWindow().on('leave-full-screen', this.handleLeaveFullScreen);
  }

  componentWillUnmount() {
    window.remote.getCurrentWindow().removeListener('enter-full-screen', this.handleEnterFullScreen);
    window.remote.getCurrentWindow().removeListener('leave-full-screen', this.handleLeaveFullScreen);
  }

  handleEnterFullScreen() {
    const { onUpdateIsFullScreen } = this.props;
    onUpdateIsFullScreen(true);
  }

  handleLeaveFullScreen() {
    const { onUpdateIsFullScreen } = this.props;
    onUpdateIsFullScreen(false);
  }

  render() {
    const { shouldUseDarkColors } = this.props;

    const themeObj = {
      typography: {
        fontSize: 13.5,
      },
      palette: {
        type: shouldUseDarkColors ? 'dark' : 'light',
        primary: {
          light: blue[300],
          main: blue[600],
          dark: blue[800],
        },
        secondary: {
          light: red[300],
          main: red[500],
          dark: red[700],
        },
      },
    };

    if (!shouldUseDarkColors) {
      themeObj.background = {
        primary: grey[200],
      };
    }

    const theme = createMuiTheme(themeObj);

    return (
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    );
  }
}

AppWrapper.propTypes = {
  shouldUseDarkColors: PropTypes.bool.isRequired,
  onUpdateIsFullScreen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

const actionCreators = {
  updateIsFullScreen,
};

export default connectComponent(
  AppWrapper,
  mapStateToProps,
  actionCreators,
  null,
);
