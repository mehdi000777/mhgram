import { GlobalyTypes } from '../actionTypes/globalTypes';


export const ModalReducer = (state = false, action) => {
    switch (action.type) {
        case GlobalyTypes.MODAL:
            return action.payLoad
        default:
            return state
    }
}