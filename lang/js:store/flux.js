const {Dispatcher} = require('flux');

const dispatcher = new Dispatcher();
const FOO_ACTION = 'FOO';
const Store = {
  count: 0
};
let fooToken = null;

dispatcher.register(payload => {
  if (payload.type === FOO_ACTION) {
    dispatcher.waitFor([fooToken]);
    console.log(Store.count); // 1
  }
});

fooToken = dispatcher.register(payload => {
  if (payload.type === FOO_ACTION) {
    Store.count++;
  }
});

const Action = {
  increment() {
    dispatcher.dispatch({
      type: FOO_ACTION
    });
  }
}

Action.increment();
