import { GlobalyTypes } from '../actionTypes/globalTypes';

const initialState = {}

export const AlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case GlobalyTypes.ALERT:
            return {
                msg: action.msg
            }
        case GlobalyTypes.ALERT_RESET:
            return {}
        default:
            return state
    }
}