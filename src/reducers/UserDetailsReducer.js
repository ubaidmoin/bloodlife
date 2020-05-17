import * as Actions from '../actions/ActionTypes';

const initialState = {
    id: 1,
    firstName: 'Admin',
    lastName: '',
    email: 'admin',
    phoneNo: '03325320328',    
    userType: 'admin' ,
    image: '',
    ratings: 4.75
}

const UserDetailsReducer = (state ={userDetails: initialState},action) => {              
    switch (action.type){        
        case Actions.SET_USER_DATA:                     
            return {
                ...state,
                userDetails: action.payload                
            }; 
        default:
            return state;
    }
}
export default UserDetailsReducer;
