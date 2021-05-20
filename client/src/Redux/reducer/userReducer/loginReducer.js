import { Types } from '../../actionTypes/userTypes';

const initialState = {}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.USER_LOGIN:
            return {
                loading: true
            }
        case Types.USER_LOGIN_SUCCESS:
            return {
                loading: false,
                userInfo: action.data.user,
                token: action.data.access_token,
                success: action.data.message
            }
        case Types.USER_LOGIN_FAILD:
            return {
                loading: false,
                error: action.error
            }
        case Types.USER_VALIDATE:
            return {
                valid: action.data
            }
        case Types.USER_LOGIN_RESET:
            return {
                ...state,
                success: null,
                loading: null,
                error: null
            }
        case Types.USER_LOGOUT:
            return {}
        default:
            return state
    }
}