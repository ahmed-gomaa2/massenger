import {combineReducers} from "redux";
import authReducer from './auth';
import usersReducer from './users';
import roomsReducer from './rooms';


// const sidebarShowHandler = (state = {
//     show: true
// }, action) => {
//     switch (action.type) {
//         case 'SIDEBAR_TOGGLE':
//             return {
//                 ...state,
//                 show: !state.show
//             }
//         default:
//             return state;
//     }
// }


export default combineReducers({
    auth: authReducer,
    users: usersReducer,
    rooms: roomsReducer,
    // sidebar: sidebarShowHandler
});