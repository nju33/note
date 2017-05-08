const {observable, action, reaction} = require('mobx');

const store = observable({
  count: 0,
});

const Action = {
  increment: action.bound(function () {
    store.count++;
  }).bind(store)
};

reaction(
  () => store.count,
  count => console.log(count)
);

Action.increment();
