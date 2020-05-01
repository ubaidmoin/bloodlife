import * as Actions from '../actions/ActionTypes';

const initialState = {
    id: 1,
    firstName: 'Ubaid',
    lastName: 'Ullah',
    email: 'tanwer.ubaid@gmail.com',
    phoneNo: '03325320328',    
    userType: 'Donor' ,
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
