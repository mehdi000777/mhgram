import axios from "axios"
import { GlobalyTypes } from "../actionTypes/globalTypes"
import { notifyTypes } from "../actionTypes/notifyTypes"


export const getNotifies = (token) => {
    return {
        type: notifyTypes.GET_NOTIFIES,
        successType: notifyTypes.GET_NOTIFIES_SUCCESS,
        faildType: notifyTypes.GET_NOTIFIES_FAILD,
        isEndpointCalled: true,
        endpoint: "notifies",
        method: "get",
        headers: {
            Authorization: token
        }
    }
}

export const createNotify = (msg, token, userInfo, socket) => {
    return async dispatch => {
        try {
            const res = await axios("/api/notify", {
                method: "post",
                data: msg,
                headers: {
                    Authorization: token
                }
            });
            socket.emit("createNotify", {
                ...res.data.notify,
                user: {
                    username: userInfo.username,
                    avatar: userInfo.avatar
                }
            });
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message });
        }
    }
}


export const removeNotify = (msg, token, socket) => {
    return async dispatch => {
        try {
            await axios(`/api/notify/${msg.id}?url=${msg.url}`, {
                method: "delete",
                headers: {
                    Authorization: token
                }
            });
            socket.emit("removeNotify", msg);
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message });
        }
    }
}

export const isReadNotify = (msg, token) => {
    return async dispatch => {
        const newNotify = { ...msg, isRead: true };

        dispatch({
            type: notifyTypes.UPDATE_NOTIFY,
            isEndpointCalled: false,
            notify: newNotify
        })

        try {
            await axios(`/api/isReadNotify/${msg._id}`, {
                method: "patch",
                headers: {
                    Authorization: token
                }
            });
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message });
        }
    }
}

export const deleteAllNotifies = (token) => {
    return dispatch => {
        dispatch({
            type: notifyTypes.DELETE_ALL_NOTIFIES,
            isEndpointCalled: false
        });

        try {
            axios("/api/deleteAllNotify", {
                method: "delete",
                headers: {
                    Authorization: token
                }
            })
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message });
        }
    }
}