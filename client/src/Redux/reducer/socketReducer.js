import { GlobalyTypes } from '../actionTypes/globalTypes';

const initialState = {}

export const SocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case GlobalyTypes.SOCKET:
            return action.payload
        default:
            return state
    }
}