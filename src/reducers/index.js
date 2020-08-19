import {combineReducers, createStore} from 'redux';
import userDetailsReducer from './UserDetailsReducer';
import showFieldsReducer from './ShowFieldsReducer';

const AppReducers = combineReducers({
  userDetailsReducer,
  showFieldsReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

let store = createStore(rootReducer);

export default store;
