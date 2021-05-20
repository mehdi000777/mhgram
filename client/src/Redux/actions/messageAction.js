import { GlobalyTypes } from '../actionTypes/globalTypes';
import { messageTypes } from '../actionTypes/messageTypes';
import axios from 'axios';


export const addUser = (user, message) => {
    return dispatch => {
        if (message.users.every(item => item._id !== user._id)) {
            dispatch({
                type: messageTypes.ADD_USER,
                data: { user }
            })
        }
    }
}

export const addMessage = (msg, userLogin, socket) => {
    return async dispatch => {
        dispatch({
            type: messageTypes.ADD_MESSAGE,
            isEndpointCalled: false,
            data: msg,
        });
        try {
            await axios("/api/message", {
                method: "post",
                data: msg,
                headers: {
                    Authorization: userLogin.token
                }
            })
            socket.emit("addMessage", { msg, userSender: userLogin.userInfo });
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const getConversation = (token, userInfo, page = 1) => {
    return async dispatch => {
        try {
            const res = await axios(`/api/conversations?limit=${page * 9}`, {
                method: "get",
                headers: {
                    Authorization: token
                }
            })

            let newArr = [];
            res.data.conversation.forEach(item => {
                item.recipients.forEach(cv => {
                    if (cv._id !== userInfo._id) {
                        newArr.push({ ...cv, text: item.text, media: item.media, call: item.call });
                    }
                })
            });
            
            dispatch({ type: messageTypes.GET_CONVERSATION, isEndpointCalled: false, data: { newArr, result: res.data.result } });

        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const getMessages = (id, userLogin, page = 1, message) => {
    return async dispatch => {
        try {
            const res = await axios(`/api/message/${id}?limit=${page * 9}`, {
                method: "get",
                headers: {
                    Authorization: userLogin.token
                }
            })
            const newData = { ...res.data, messages: res.data.messages.reverse() }

            dispatch({ type: messageTypes.GET_MESSAGE, isEndpointCalled: false, data: { ...newData, _id: id, page } });

        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const loadMoreMessages = ({ id, userLogin, page }) => {
    return async dispatch => {
        try {
            const res = await axios(`/api/message/${id}?limit=${page * 9}`, {
                method: "get",
                headers: {
                    Authorization: userLogin.token
                }
            })
            const newData = { ...res.data, messages: res.data.messages.reverse() }

            dispatch({ type: messageTypes.UPDATE_MESSAGE, isEndpointCalled: false, data: { ...newData, _id: id, page } });

        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const deleteMessage = (msg, data, userLogin) => {
    return async dispatch => {
        const newData = data.filter(item => item._id !== msg._id);
        dispatch({
            type: messageTypes.DELETE_MESSAGE,
            isEndpointCalled: false,
            data: { newData, _id: msg.recipient }
        });

        try {
            await axios(`/api/message/${msg._id}`, {
                method: "delete",
                headers: {
                    Authorization: userLogin.token
                }
            })
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const deleteConversation = (id, userLogin) => {
    return async dispatch => {
        dispatch({
            type: messageTypes.DELETE_CONVERSATION,
            isEndpointCalled: false,
            id
        })

        try {
            await axios(`/api/conversation/${id}`, {
                method: "delete",
                headers: {
                    Authorization: userLogin.token
                }
            })
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}