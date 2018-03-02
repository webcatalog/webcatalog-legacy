/* global it */
const assert = require('assert');

const harness = require('./utils/_harness');

harness('start-up', () => {
  it('Start up', () =>
    global.app.client
      .getWindowCount().then((count) => {
        assert.equal(count, 2);
      }));
}, []);
