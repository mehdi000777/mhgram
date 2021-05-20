import { GlobalyTypes } from '../actionTypes/globalTypes';


export const StatusReducer = (state = false, action) => {
    switch (action.type) {
        case GlobalyTypes.STATUS:
            return action.payLoad
        default:
            return state
    }
}