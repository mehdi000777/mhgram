import { Types } from '../../actionTypes/userTypes';

const initialState = {}

export const FollowReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.USER_FOLLOW:
            return {}
        case Types.USER_FOLLOW_SUCCESS:
            return {
                success: action.data.message
            }
        case Types.USER_FOLLOW_FAILD:
            return {
                error: action.error
            }
        default:
            return state
    }
}