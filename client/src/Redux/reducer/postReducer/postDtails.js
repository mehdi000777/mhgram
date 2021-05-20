import { PostTypes } from '../../actionTypes/postTypes';

const initialState = {
    postDtails: []
}

export const PostDtailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PostTypes.POST_DTAILS:
            return {
                ...state,
                loading: true
            }
        case PostTypes.POST_DTAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                postDtails: [...state.postDtails, action.data.post],
            }
        case PostTypes.POST_DTAILS_FAILD:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case PostTypes.UPDATE_POST_SUCCESS:
            return {
                ...state,
                postDtails: state.postDtails.map(item => item._id === action.data.newPost._id ? action.data.newPost : item)
            }
        default:
            return state
    }
}