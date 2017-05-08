const {createStore} = require('redux');

const FOO_ACTION = 'FOO_ACTION';
const defaultState = {
  count: 0
};
function manage(state = defaultState, action) {
  if (action.type === FOO_ACTION) {
    const s = Object.assign({}, state);
    s.count++;
    return s;
  }
  return state;
}
const store = createStore(manage);
store.subscribe(() => {
  console.log(store.getState().count);
})

const Action = {
  increment() {
    store.dispatch({type: FOO_ACTION});
  }
};

Action.increment();
