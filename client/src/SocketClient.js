import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { notifyTypes } from './Redux/actionTypes/notifyTypes';
import { PostTypes } from './Redux/actionTypes/postTypes';
import { Types } from './Redux/actionTypes/userTypes';
import audioBell from './audio/got-it-done-613.mp3';
import { messageTypes } from './Redux/actionTypes/messageTypes';
import { GlobalyTypes } from './Redux/actionTypes/globalTypes';

export default function SocketClient() {

    const { socket, notify, message, online, call } = useSelector(state => state)
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, token } = userLogin;

    const dispatch = useDispatch();

    const spownNotification = (body, icon, title, url) => {
        let options = {
            body, icon
        };
        let n = new Notification(title, options);

        n.onclick = e => {
            e.preventDefault();
            window.open(url, '_blank');
        }
    }

    useEffect(() => {
        socket.emit("joinUser", userInfo);
    }, [socket, userInfo])

    //likes
    useEffect(() => {
        socket.on("likeToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("likeToClient");
    }, [dispatch, socket])

    useEffect(() => {
        socket.on("unLikeToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("unLikeToClient");
    }, [dispatch, socket])

    //comments
    useEffect(() => {
        socket.on("createCommentToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("createCommentToClient");
    }, [dispatch, socket])

    useEffect(() => {
        socket.on("updateCommentToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("updateCommentToClient");
    }, [dispatch, socket])

    useEffect(() => {
        socket.on("likeCommentToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("likeCommentToClient");
    }, [dispatch, socket])

    useEffect(() => {
        socket.on("unlikeCommentToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("unlikeCommentToClient");
    }, [dispatch, socket])

    useEffect(() => {
        socket.on("removeCommentToClient", newPost => {
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            })
        });
        return () => socket.off("removeCommentToClient");
    }, [dispatch, socket])

    //follow
    useEffect(() => {
        socket.on("followToClient", newUser => {
            dispatch({
                type: Types.USER_LOGIN_SUCCESS,
                isEndpointCalled: false,
                data: {
                    access_token: token,
                    user: {
                        ...newUser
                    }
                }
            });
        });
        return () => socket.off("followToClient");
    }, [dispatch, socket, token])

    useEffect(() => {
        socket.on("unFollowToClient", newUser => {
            dispatch({
                type: Types.USER_LOGIN_SUCCESS,
                isEndpointCalled: false,
                data: {
                    access_token: token,
                    user: {
                        ...newUser
                    }
                }
            });
        });
        return () => socket.off("unFollowToClient");
    }, [dispatch, socket, token])

    //Nofity
    useEffect(() => {
        socket.on("createNotifyToClient", msg => {
            dispatch({
                type: notifyTypes.CREATE_NOTIFIES,
                isEndpointCalled: false,
                notify: msg
            });

            if (notify.sound) new Audio(audioBell).play();

            spownNotification(
                msg.user.username + " " + msg.text,
                msg.user.avatar,
                "MHGRAM",
                msg.url
            );
        });
        return () => socket.off("createNotifyToClient");
    }, [dispatch, socket, notify.sound]);

    useEffect(() => {
        socket.on("removeNotifyToClient", msg => {
            dispatch({
                type: notifyTypes.REMOVE_NOTIFIES,
                isEndpointCalled: false,
                notify: msg
            })
        })
        return () => socket.off("removeNotifyToClient");
    }, [dispatch, socket]);

    // Message

    useEffect(() => {
        socket.on("addMessageClient", ({ msg, userSender }) => {
            dispatch({
                type: messageTypes.ADD_MESSAGE,
                isEndpointCalled: false,
                data: msg,
            });
            if (message.users.every(item => item._id !== msg.sender)) {
                dispatch({
                    type: messageTypes.ADD_USER,
                    data: { user: { ...userSender, text: msg.text, media: msg.media } }
                });
            }
        })
        return () => socket.off("addMessageClient");
    }, [dispatch, socket, message.users]);

    // Online or Offline User

    useEffect(() => {
        socket.emit("checkUserOnline", userInfo);
    }, [socket, userInfo]);

    // Check User Online

    useEffect(() => {
        socket.on("checkUserOnlineToMe", data => {
            if (!online.includes(data.id)) {
                data.forEach(item => {
                    dispatch({
                        type: GlobalyTypes.ONLINE,
                        isEndpointCalled: false,
                        data: item.id
                    })
                })
            }
        })
        return () => socket.off("checkUserOnlineToMe");
    }, [dispatch, socket, online]);

    useEffect(() => {
        socket.on("checkUserOnlineToClient", id => {
            if (!online.includes(id)) {
                dispatch({
                    type: GlobalyTypes.ONLINE,
                    isEndpointCalled: false,
                    data: id
                })
            }
        })
        return () => socket.off("checkUserOnlineToClient");
    }, [dispatch, socket, online]);

    // Check User Offline

    useEffect(() => {
        socket.on("checkUserOffline", id => {
            dispatch({
                type: GlobalyTypes.OFFLINE,
                isEndpointCalled: false,
                data: id
            })
        })
        return () => socket.off("checkUserOffline");
    }, [dispatch, socket, online]);

    // Call

    useEffect(() => {
        socket.on("callUserToClient", msg => {
            
            dispatch({
                type: GlobalyTypes.CALL,
                isEndpointCalled: false,
                data: msg
            })
        })
        return () => socket.off("callUserToClient");
    }, [dispatch, socket]);

    useEffect(() => {
        socket.on("userBusy", data => {
            dispatch({
                type: GlobalyTypes.ALERT,
                isEndpointCalled: false,
                msg: `${call.username} is busy!`
            })
        })
        return () => socket.off("userBusy");
    }, [dispatch, socket, call]);

    return <></>
}
