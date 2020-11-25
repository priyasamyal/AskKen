import { constant } from '../common/index';
const initialState = {
        session:{}
};
export default (state = initialState, action) => {
    switch (action.type) {
        case constant.SET_SESSION:
            return {
                ...state,
                session: action.payload
            };
       
        default:
            return state
    }

}