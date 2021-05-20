import { notifyTypes } from '../../actionTypes/notifyTypes';

const initialState = {
    loading: false,
    notifies: [],
    sound: false
}

export const notifiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case notifyTypes.GET_NOTIFIES:
            return {
                ...state,
                loading: true
            }
        case notifyTypes.GET_NOTIFIES_SUCCESS:
            return {
                ...state,
                loading: false,
                notifies: action.data.notifies,
            }
        case notifyTypes.GET_NOTIFIES_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case notifyTypes.CREATE_NOTIFIES:
            return {
                ...state,
                notifies: [action.notify, ...state.notifies]
            }
        case notifyTypes.REMOVE_NOTIFIES:
            return {
                ...state,
                notifies: state.notifies.filter(item => item.id !== action.notify.id || item.url !== action.notify.url)
            }
        case notifyTypes.UPDATE_NOTIFY:
            return {
                ...state,
                notifies: state.notifies.map(item => item._id === action.notify._id
                    ? action.notify : item)
            }
        case notifyTypes.UPDATE_SOUND:
            return {
                ...state,
                sound: action.notify
            }
        case notifyTypes.DELETE_ALL_NOTIFIES:
            return {
                ...state,
                notifies: []
            }
        default:
            return state
    }
}