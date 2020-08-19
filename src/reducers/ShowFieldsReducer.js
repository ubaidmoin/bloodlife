import * as Actions from '../actions/ActionTypes';

const initialState = true;

const ShowFieldsReducer = (state = {showFields: initialState}, action) => {
  switch (action.type) {
    case Actions.SET_SHOW_FIELDS:
      return {
        ...state,
        showFields: action.payload,
      };
    default:
      return state;
  }
};
export default ShowFieldsReducer;
