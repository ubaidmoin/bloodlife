import {combineReducers, createStore} from 'redux';
import userDetailsReducer from './UserDetailsReducer';

const AppReducers = combineReducers({
  userDetailsReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

let store = createStore(rootReducer);

export default store;
