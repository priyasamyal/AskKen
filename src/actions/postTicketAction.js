import { constant } from '../common/index';
export const selectedCategory = (user) => {
    return {
        type: constant.SELECT_CATEGORY,
        payload: user
    }
}

export const setDescription = (user) => {
    return {
        type: constant.SET_DESCRIPTION,
        payload: user
    }
}

export const setTicketPhoto = (user) => {
    return {
        type: constant.SET_TICKET_PHOTO,
        payload: user
    }
}

export const setTicketPayment = (user) => {
    return {
        type: constant.TICKET_PAYMENT,
        payload: user
    }
}

export const setAllTickets = (user) => {
    return {
        type: constant.SET_TICKETS,
        payload: user
    }
}
export const setChatLists = (data) => {
    return {
        type: constant.SET_CHATLIST,
        payload: data
    }

    
}

export const setSession = (data) => {
    console.log("ChatDatat", data);
    return {
        type: constant.SET_SESSION,
        payload: data
    }

    
}
