import { GlobalyTypes } from '../actionTypes/globalTypes';

const initialState = false

export const ThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GlobalyTypes.THEME:
            return action.theme
        default:
            return state
    }
}