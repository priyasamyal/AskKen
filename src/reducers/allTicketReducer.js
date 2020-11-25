import { constant } from '../common/index';
const initialState = [];
export default (state = initialState, action) => {
    switch (action.type) {
        case constant.SET_TICKETS:
            state = action.payload
            return [...state]






        default:
            return state
    }

}