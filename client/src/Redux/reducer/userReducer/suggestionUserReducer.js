import { Types } from '../../actionTypes/userTypes';

const initialState = {
    loading: false,
    users: []
}

export const SuggestionUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SUGGESTION_USER:
            return {
                loading: true
            }
        case Types.SUGGESTION_USER_SUCCESS:
            return {
                loading: false,
                users: action.data.users,
                result: action.data.result
            }
        case Types.SUGGESTION_USER_FAILD:
            return {
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}