import alt from '../alt';
import WebAppActions from '../actions/web-app';
import Parse from 'parse';
import Immutable from 'immutable';
import immutable from 'alt-utils/lib/ImmutableUtil';

Parse.initialize('VNhL0WfW4huzafXZvY4FSRFtXeQAHzQ8vs0xOMjQ', 'OWwwLkcWgwgbaLOqZKKLGArzvpH7YBBQVAzaQyNA');
const WebApp = Parse.Object.extend("WebApp");

let lastToken;

class WebAppStore {
  constructor() {
    this.bindListeners({
      fetch: WebAppActions.fetch,
      fetchMore: WebAppActions.fetchMore,
      refresh: WebAppActions.refresh
    });

    this.state = Immutable.Map({
      status: 'loading',
      type: null,
      data: null,
      webApps: Immutable.List([]),
      loadMoreOk: true
    });
  }

  fetch({ type, data, skipNum }) {
    let token = new Date().getTime();
    lastToken = token;

    if (skipNum) {
      this.setState(
        this.state
          .set('type', type)
          .set('data', data)
          .set('status', 'loading')
      );
    }
    else {
      this.setState(
        this.state
          .set('type', type)
          .set('data', data)
          .set('status', 'loading')
          .set('webApps', Immutable.List([]))
      );
    }

    let query = new Parse.Query(WebApp);
    query.select('name', 'url', 'icon180x180', 'icon512x512', 'category', 'developer');
    query.equalTo('approved', true);
    query.limit(20);
    if (skipNum) {
      query.skip(skipNum);
    }

    if (type == 'most-installed') {
      query.descending('installCount, createdAt');
    }
    if (type == 'new') {
      query.descending('createdAt');
    }
    if (type == 'category-most-installed') {
      query.equalTo('category', data);
      query.descending('installCount, createdAt');
    }
    if (type == 'category-new') {
      query.equalTo('category', data);
      query.descending('createdAt');
    }
    if (type == 'search') {
      query.matches('name', data, 'i');
      query.descending('downloads');
    }

    query.find().then(
      results => {
        let webApps = this.state.get('webApps')
                        .concat(results.map(webApp => {
                          return Immutable.Map({
                            id: webApp.id,
                            name: webApp.get('name'),
                            url: webApp.get('url'),
                            icon180x180: webApp.get('icon180x180').url(),
                            icon512x512: webApp.get('icon512x512').url(),
                            category: webApp.get('category'),
                            developer: webApp.get('developer')
                          });
                        }));

        let loadMoreOk = true;
        if (results.length < 20) loadMoreOk = false;

        if (token == lastToken) {
          this.setState(
            this.state
              .set('status', 'done')
              .set('webApps', webApps)
              .set('loadMoreOk', loadMoreOk)
          );
        }
      },
      (object, error) => {
        if (token == lastToken) {
          this.setState(
            this.state
              .set('status', 'failed')
          );
        }
      }
    );
  }

  fetchMore() {
    let size = this.state.get('webApps').size;
    let type = this.state.get('type');
    let data = this.state.get('data');
    this.fetch({ skipNum: size, type, data });
  }

  refresh() {
    let type = this.state.get('type');
    let data = this.state.get('data');
    this.fetch({ type, data });
  }
}

export default alt.createStore(immutable(WebAppStore), 'WebAppStore');
