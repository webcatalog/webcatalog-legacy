import WebAppStore from '../stores/web-app';

const ConnectToWebStoreMixin = {
  getInitialState() {
    return {
      webAppStore: WebAppStore.getState()
    };
  },

  componentDidMount: function() {
    WebAppStore.listen(this.onChange);
  },

  componentWillUnmount() {
    WebAppStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState({
      webAppStore: state
    });
  }
};
export default ConnectToWebStoreMixin;
