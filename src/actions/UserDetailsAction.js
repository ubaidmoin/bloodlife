import * as Actions from './ActionTypes';

export const mapStateToProps = (state) => ({
  userDetails: state.userDetailsReducer.userDetails,
  showFields: state.showFieldsReducer.showFields,
});

export const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch({type: Actions.SET_USER_DATA, payload: data}),
  setShowFields: (data) => dispatch({type: Actions.SET_SHOW_FIELDS, payload: data}),
});
