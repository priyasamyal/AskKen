import { constant } from '../common/index';
const initialState = {
    categories: [],
    description: "",
    type: '',
    uri: '',
    chatList: []
};
export default (state = initialState, action) => {
    switch (action.type) {
        case constant.SELECT_CATEGORY:
            return {
                ...state,
                categories: action.payload
            };
        case constant.SET_DESCRIPTION:
            return {
                ...state,
                description: action.payload
            };
        case constant.SET_TICKET_PHOTO:
            return {
                ...state,
                type: action.payload.type,
                uri: action.payload.uri,
            };
        case constant.SET_CHATLIST:
            return {
                ...state,
                chatList: action.payload
            };
        default:
            return state
    }

}