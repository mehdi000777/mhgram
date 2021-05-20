import { GlobalyTypes } from '../actionTypes/globalTypes';

const initialState = []

export const OnlineReducer = (state = initialState, action) => {
    switch (action.type) {
        case GlobalyTypes.ONLINE:
            return [...state, action.data]
        case GlobalyTypes.OFFLINE:
            return state.filter(item => item !== action.data)
        default:
            return state
    }
}