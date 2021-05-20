import { GlobalyTypes } from '../actionTypes/globalTypes';

const initialState = {}

export const PeerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GlobalyTypes.PEER:
            return action.payload
        default:
            return state
    }
}