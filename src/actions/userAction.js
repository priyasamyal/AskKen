import { constant } from '../common/index';
export const setUser = (user) => {
    return {
        type: constant.SET_USER,
        payload: user
    }
}

export const setUserType = (user) => {
    return {
        type: constant.SET_USER_TYPE,
        payload: user
    }
}

export const setUserPhoneNumber = (user) => {
    return {
        type: constant.SET_USER_PHONE,
        payload: user
    }
}

export const setAccountInfo = (user) => {
    return {
        type: constant.SET_ACCOUNT,
        payload: user
    }
}


export const setDeviceToken = (user) => {
    return {
        type: constant.SET_DEVICE_TOKEN,
        payload: user
    }
}

export const setVoipToken = (user) => {
    return {
        type: constant.SET_VOIP_TOKEN,
        payload: user
    }
}
export const setUserData = (user) => {
    return {
        type: constant.SET_USER_DATA,
        payload: user
    }
}
export const setCategory = (user) => {
    return {
        type: constant.SET_CATEGORY,
        payload: user
    }
}
export const setCurrentTicket = (user) => {
        return {
            type: constant.SET_CURRENT_TICKET,
            payload: user
        }
    
}


