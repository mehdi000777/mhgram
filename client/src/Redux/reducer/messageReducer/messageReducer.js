import { messageTypes } from '../../actionTypes/messageTypes';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,
}

export const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case messageTypes.ADD_USER:
            return {
                ...state,
                users: [action.data.user, ...state.users]
            }
        case messageTypes.ADD_MESSAGE:
            return {
                ...state,
                data: state.data.map(item =>
                    item._id === action.data.recipient || action.data.sender
                        ? {
                            ...item,
                            messages: [...item.messages, action.data],
                            result: item.result + 1
                        }
                        : item
                ),
                users: state.users.map(user =>
                    user._id === action.data.recipient || user._id === action.data.sender
                        ? {
                            ...user,
                            text: action.data.text,
                            media: action.data.media,
                            call: action.data.call
                        }
                        : user
                )
            }
        case messageTypes.GET_CONVERSATION:
            return {
                ...state,
                users: action.data.newArr,
                resultUsers: action.data.result,
                firstLoad: true
            }
        case messageTypes.GET_MESSAGE:
            return {
                ...state,
                data: [...state.data, action.data],
            }
        case messageTypes.UPDATE_MESSAGE:
            return {
                ...state,
                data: state.data.map(item =>
                    item._id === action.data._id
                        ? action.data
                        : item
                )
            }
        case messageTypes.DELETE_MESSAGE:
            return {
                ...state,
                data: state.data.map(item =>
                    item._id === action.data._id
                        ? { ...item, messages: action.data.newData }
                        : item
                )
            }
        case messageTypes.DELETE_CONVERSATION:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.id),
                data: state.data.filter(item => item._id !== action.id)
            }
        case messageTypes.USER_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(user =>
                    action.data.includes(user._id)
                        ? { ...user, online: true }
                        : { ...user, online: false }
                )
            }
        default:
            return state
    }
}