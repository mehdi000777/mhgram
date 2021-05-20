import { Types } from '../actionTypes/userTypes';
import { GlobalyTypes } from '../actionTypes/globalTypes';
import valid from '../../Utils/valid';
import { imageUpload } from '../../Utils/imageUpload';
import { createNotify, removeNotify } from './notifyAction';


export const userLogin = (data) => {
    return dispatch => {
        dispatch({
            type: Types.USER_LOGIN,
            successType: Types.USER_LOGIN_SUCCESS,
            faildType: Types.USER_LOGIN_FAILD,
            isEndpointCalled: true,
            endpoint: "login",
            method: "Post",
            data
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem("firstLogin", true);
            }
        })
    }
}

export const userLoginReset = () => {
    return {
        type: Types.USER_LOGIN_RESET,
        isEndpointCalled: false,
    }
}

export const refresh_token = () => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
        return dispatch => {
            dispatch({
                type: Types.USER_LOGIN,
                successType: Types.USER_LOGIN_SUCCESS,
                faildType: Types.USER_LOGIN_FAILD,
                isEndpointCalled: true,
                endpoint: "refresh_token",
                method: "Post",
            }).then(response => {
                if (response.status === 200) {
                    dispatch(userLoginReset());
                }
            })
        }
    }
    else {
        return {
            type: Types.USER_LOGIN_RESET,
            isEndpointCalled: false,
        }
    }
}

export const user_Validate = (data) => {
    return {
        isEndpointCalled: false,
        type: Types.USER_VALIDATE,
        data
    }
}

export const registerUser = (data) => {
    return dispatch => {
        const checked = valid(data);
        if (checked.errLength > 0) {
            dispatch(user_Validate(checked))
        }
        else {
            dispatch({
                type: Types.USER_LOGIN,
                successType: Types.USER_LOGIN_SUCCESS,
                faildType: Types.USER_LOGIN_FAILD,
                isEndpointCalled: true,
                endpoint: "register",
                method: "Post",
                data
            }).then(response => {
                if (response.status === 200) {
                    localStorage.setItem("firstLogin", true);
                }
            })
        }
    }
}

export const userLogout = () => {
    localStorage.removeItem("firstLogin");
    return {
        type: Types.USER_LOGOUT,
        successType: Types.USER_LOGOUT,
        isEndpointCalled: true,
        endpoint: "logout",
        method: "Post",
    }
}

export const userProfile = (id, token) => {
    return dispatch => {
        dispatch({
            type: Types.USER_PROFILE_IDS,
            isEndpointCalled: false,
            id
        });

        dispatch({
            type: Types.USER_PROFILE_POSTS,
            successType: Types.USER_PROFILE_POSTS_SUCCESS,
            faildType: Types.USER_PROFILE_POSTS_FAILD,
            isEndpointCalled: true,
            endpoint: `user_posts/${id}`,
            method: "Get",
            id,
            headers: {
                Authorization: token
            }
        })

        dispatch({
            type: Types.USER_PROFILE,
            successType: Types.USER_PROFILE_SUCCESS,
            faildType: Types.USER_PROFILE_FAILD,
            isEndpointCalled: true,
            endpoint: `user/${id}`,
            method: "Get",
            headers: {
                Authorization: token
            }
        });
    }
}


export const updateUserProfile = ({ data, avatar, userInfo, token, userLogin }) => {
    return async dispatch => {
        if (data.fullname.length > 25) return dispatch({
            type: GlobalyTypes.ALERT,
            isEndpointCalled: false,
            msg: "Your full name is too long."
        });
        if (data.story.length > 200) return dispatch({
            type: GlobalyTypes.ALERT,
            isEndpointCalled: false,
            msg: "Your story is too long."
        });
        dispatch({ type: Types.USER_PROFILE_UPDATE, isEndpointCalled: false })
        let media;
        if (avatar) media = await imageUpload([avatar]);
        dispatch({
            type: Types.USER_PROFILE_UPDATE,
            successType: Types.USER_PROFILE_UPDATE_SUCCESS,
            faildType: Types.USER_PROFILE_UPDATE_FAILD,
            isEndpointCalled: true,
            endpoint: "user",
            method: "Patch",
            data: {
                ...data,
                avatar: avatar ? media[0].url : userInfo.avatar
            },
            headers: {
                Authorization: token
            }
        });
        dispatch({
            type: Types.USER_LOGIN_SUCCESS,
            isEndpointCalled: false,
            data: {
                access_token: token,
                user: {
                    ...userInfo,
                    ...data,
                    avatar: avatar ? media[0].url : userInfo.avatar
                }
            }
        })
    }
}

export const follow = (users, userInfo, user, token, socket) => {
    return dispatch => {
        let newUser;
        if (users.every(item => item._id !== user._id)) {
            newUser = { ...user, followers: [...user.followers, userInfo] };
        }
        else {
            users.forEach(item => {
                if (item._id === user._id) {
                    newUser = { ...item, followers: [...item.followers, userInfo] };
                }
            })
        }

        dispatch({
            type: Types.FOLLOW,
            isEndpointCalled: false,
            user: newUser
        });
        dispatch({
            type: Types.USER_LOGIN_SUCCESS,
            isEndpointCalled: false,
            data: {
                access_token: token,
                user: {
                    ...userInfo,
                    following: [
                        ...userInfo.following,
                        newUser
                    ]
                }
            }
        });

        dispatch({
            type: Types.USER_FOLLOW,
            successType: Types.USER_FOLLOW_SUCCESS,
            faildType: Types.USER_FOLLOW_FAILD,
            isEndpointCalled: true,
            endpoint: `user/${user._id}/follow`,
            method: "Patch",
            headers: {
                Authorization: token
            }
        }).then(res => {
            socket.emit("follow", res.data.newUser);

            const msg = {
                id: userInfo._id,
                recipients: newUser._id,
                url: `/profile/${userInfo._id}`,
                text: "has started to follow you.",
            }

            dispatch(createNotify(msg, token, userInfo, socket));
        })
    }
}

export const unFollow = (users, userInfo, user, token, socket) => {
    return dispatch => {
        let newUser;
        if (users.every(item => item._id !== user._id)) {
            newUser = { ...user, followers: user.followers.filter(item => item._id !== userInfo._id) };
        }
        else {
            users.forEach(item => {
                if (item._id === user._id) {
                    newUser = { ...item, followers: item.followers.filter(i => i._id !== userInfo._id) };
                }
            })
        }

        dispatch({
            type: Types.UNFOLLOW,
            isEndpointCalled: false,
            user: newUser
        });
        dispatch({
            type: Types.USER_LOGIN_SUCCESS,
            isEndpointCalled: false,
            data: {
                access_token: token,
                user: {
                    ...userInfo,
                    following: userInfo.following.filter(item => item._id !== newUser._id)
                }
            }
        });

        dispatch({
            type: Types.USER_FOLLOW,
            successType: Types.USER_FOLLOW_SUCCESS,
            faildType: Types.USER_FOLLOW_FAILD,
            isEndpointCalled: true,
            endpoint: `user/${user._id}/unfollow`,
            method: "Patch",
            headers: {
                Authorization: token
            }
        }).then(res => {
            socket.emit("unFollow", res.data.newUser);

            const msg = {
                id: userInfo._id,
                recipients: newUser._id,
                url: `/profile/${userInfo._id}`,
                text: "has started to follow you.",
            }

            dispatch(removeNotify(msg, token, socket));
        })
    }
}

export const suggestionsUser = (token) => {
    return {
        type: Types.SUGGESTION_USER,
        successType: Types.SUGGESTION_USER_SUCCESS,
        faildType: Types.SUGGESTION_USER_FAILD,
        isEndpointCalled: true,
        endpoint: "suggestionsUser",
        method: "Get",
        headers: {
            Authorization: token
        }
    }
}