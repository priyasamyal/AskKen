import { constant } from '../common/index';
import { getItem, setItem } from '../common/user';
const initialState = {
    user_type: '',
    phone_number: '',
    phone_code: '',
    verification_code: '',
    name: '',
    password: '',
    email: '',
    device_token: '',
    voip_token:'',
    uuid: '',
    profile_image: '',
    categories: [],
    userData: {}
};


export default (state = initialState, action) => {

    switch (action.type) {
        case constant.SET_ACCOUNT:
            return {
                ...state,
                name: action.payload.name,
                password: action.payload.password,
                email: action.payload.email
            };
        case constant.SET_DEVICE_TOKEN:
            return {
                ...state,
                device_token: action.payload.device_token,
                uuid: action.payload.uuid,
            };
        case constant.SET_VOIP_TOKEN:
             return {
                 ...state,
                 voip_token: action.payload.voip_token,
        };    
        case constant.SET_CURRENT_TICKET:
            return {
                ...state,
                current_ticket: action.payload,
            };    
        case constant.SET_CATEGORY:
            return {
                ...state,
                categories: action.payload,
            };
        case constant.SET_USER_TYPE:
            return {
                ...state,
                user_type: action.payload,
            };

        case constant.SET_USER_DATA:
            setItem('user_details', JSON.stringify(action.payload)).then(
                res => {
                   console.log("Saver user data",action.payload)
                    if (res) {
                        
                    }
                },
                err => {
                    console.log(err, "set err")
                },
            );
            return {
                ...state,
                userData: action.payload
            };
        case constant.SET_USER_PHONE:
            return {
                ...state,
                phone_number: action.payload.phone_number,
                phone_code: action.payload.phone_code,
                verification_code: action.payload.verification_code
            };
        default:
            return state
    }

}