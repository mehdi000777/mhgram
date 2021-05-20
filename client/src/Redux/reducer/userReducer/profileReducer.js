import { Types } from '../../actionTypes/userTypes';

const initialState = {
    loading: false,
    ids: [],
    users: [],
    userPosts: [],
}

export const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.USER_PROFILE:
            return {
                ...state,
                loading: true
            }
        case Types.USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                users: [...state.users, action.data.user],
                success: action.data.message
            }
        case Types.USER_PROFILE_IDS:
            return {
                ...state,
                ids: [...state.ids, action.id],
            }
        case Types.USER_PROFILE_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case Types.USER_PROFILE_POSTS:
            return {
                ...state,
                loading: true
            }
        case Types.USER_PROFILE_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                userPosts: [...state.userPosts, action.postData],
            }
        case Types.USER_PROFILE_POSTS_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case Types.FOLLOW:
            return {
                ...state,
                users: state.users.map(user => user._id === action.user._id ? action.user : user)
            }
        case Types.UNFOLLOW:
            return {
                ...state,
                users: state.users.map(user => user._id === action.user._id ? action.user : user)
            }
        case Types.PROFILE_UPDATE_PAGE:
            return {
                ...state,
                userPosts: state.userPosts.map(item => item._id === action.newPost._id ? action.newPost : item)
            }
        default:
            return state
    }
}