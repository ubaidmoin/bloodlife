import * as Actions from './ActionTypes';

export const mapStateToProps = (state) => ({
  userDetails: state.userDetailsReducer.userDetails,
});

export const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch({type: Actions.SET_USER_DATA, payload: data}),
});
