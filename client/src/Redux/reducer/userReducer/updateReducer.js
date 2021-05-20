import { Types } from '../../actionTypes/userTypes';

const initialState = {}

export const UpdateProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.USER_PROFILE_UPDATE:
            return {
                loading: true
            }
        case Types.USER_PROFILE_UPDATE_SUCCESS:
            return {
                loading: false,
                success: action.data.message
            }
        case Types.USER_PROFILE_UPDATE_FAILD:
            return {
                loading: false,
                error: action.error
            }
        case Types.USER_PROFILE_UPDATE_RESET:
            return {}
        default:
            return state
    }
}