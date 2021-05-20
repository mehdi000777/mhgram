import { GlobalyTypes } from '../../actionTypes/globalTypes';


export const callReducer = (state = null, action) => {
    switch (action.type) {
        case GlobalyTypes.CALL:
            return action.data
        default:
            return state
    }
}