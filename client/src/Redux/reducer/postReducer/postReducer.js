import { PostTypes } from '../../actionTypes/postTypes';

const initialState = {
    loading: false,
    posts: [],
    result: 0,
    page: 2
}

export const PostReducer = (state = initialState, action) => {
    switch (action.type) {
        case PostTypes.CREATE_POST:
            return {
                ...state,
                loading: true
            }
        case PostTypes.CREATE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: [action.createPostData, ...state.posts],
                success: action.data.message
            }
        case PostTypes.CREATE_POST_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case PostTypes.CREATE_POST_RESET:
            return {
                ...state,
                loading: null,
                error: null,
                success: null
            }
        case PostTypes.GET_POST:
            return {
                ...state,
                loading: true
            }
        case PostTypes.GET_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: action.data.posts,
                result: action.data.result,
            }
        case PostTypes.GET_POST_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case PostTypes.UPDATE_POST:
            return {
                ...state,
                loading: true
            }
        case PostTypes.UPDATE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: state.posts.map(item => item._id === action.data.newPost._id ? action.data.newPost : item),
                success: action.data.message
            }
        case PostTypes.UPDATE_POST_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case PostTypes.UPDATE_POST_PAGE:
            return {
                ...state,
                posts: action.data.posts,
                result: action.data.result,
                page: state.page + 1
            }
        case PostTypes.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(item => item._id !== action.post._id)
            }
        default:
            return state
    }
}