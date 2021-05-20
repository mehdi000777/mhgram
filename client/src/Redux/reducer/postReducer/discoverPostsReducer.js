import { PostTypes } from '../../actionTypes/postTypes';

const initialState = {
    loading: false,
    posts: [],
    result: 9,
    page: 2,
    firstLoad: false
}

export const DiscoverPostsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PostTypes.GET_DISCOVER_POSTS:
            return {
                ...state,
                loading: true
            }
        case PostTypes.GET_DISCOVER_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: action.data.posts,
                result: action.data.result,
                firstLoad: true
            }
        case PostTypes.GET_DISCOVER_POSTS_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case PostTypes.UPDATE_DISCOVER_POSTS:
            return {
                ...state,
                posts: action.data.posts,
                result: action.data.result,
                firstLoad: true,
                page: state.page + 1
            }
        default:
            return state
    }
}