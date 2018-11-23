import { combineReducers, createStore } from 'redux';

import { winner } from 'components/pages/Home/_reducers';

const reducers = combineReducers({
  winner,
});
const Store = createStore(reducers);

export default Store;
