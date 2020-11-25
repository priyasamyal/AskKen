import { combineReducers } from 'redux';
import userReducer from './userReducer';
import postTicketReducer from './postTicketReducer';
import allTicketReducer from './allTicketReducer';
import sessionData from './sessionData';


export default combineReducers({
    all_tickets: allTicketReducer,
    user: userReducer,
    post_ticket: postTicketReducer,
    sessionData:sessionData
})