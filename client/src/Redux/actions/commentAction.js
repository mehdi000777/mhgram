import axios from 'axios';
import { GlobalyTypes } from '../actionTypes/globalTypes';
import { PostTypes } from '../actionTypes/postTypes';
import { createNotify, removeNotify } from './notifyAction';


export const createComment = (post, newComment, token, userInfo, socket) => {
    return async dispatch => {
        const newPost = { ...post, comments: [...post.comments, newComment] };

        dispatch({
            type: PostTypes.UPDATE_POST_SUCCESS,
            isEndpointCalled: false,
            data: { newPost }
        });

        try {
            const data = { ...newComment, postId: post._id, postUserId: post.user._id };
            const res = await axios("/api/comment", {
                method: "post",
                data,
                headers: { Authorization: token }
            });

            const newData = { ...res.data.newComment, user: userInfo };
            const newPost = { ...post, comments: [...post.comments, newData] };
            dispatch({
                type: PostTypes.UPDATE_POST_SUCCESS,
                isEndpointCalled: false,
                data: { newPost }
            });
            socket.emit("createComment", newPost);

            const msg = {
                id: res.data.newComment._id,
                recipients: newComment.reply ? newComment.tag._id : newPost.user._id,
                url: `/post/${newPost._id}`,
                text: newComment.reply ? "mentiond you in a comment." : "has commented on your post.",
                content: newComment.content,
            }

            dispatch(createNotify(msg, token, userInfo, socket));
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const updateComment = (post, comment, content, token, socket) => {
    return async dispatch => {
        const newComments = post.comments.map(item => item._id === comment._id ? { ...comment, content: content } : item);
        const newPost = { ...post, comments: [...newComments] }
        dispatch({
            type: PostTypes.UPDATE_POST_SUCCESS,
            isEndpointCalled: false,
            data: { newPost }
        });

        try {
            await axios(`/api/comment/${comment._id}`, {
                method: "patch",
                data: { content },
                headers: {
                    Authorization: token
                }
            });
            socket.emit("updateComment", newPost);
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const likeComment = (post, comment, token, userInfo, socket) => {
    return async dispatch => {
        const newComments = post.comments.map(item => item._id === comment._id ?
            { ...comment, likes: [...comment.likes, userInfo] } : item);
        const newPost = { ...post, comments: [...newComments] }

        dispatch({
            type: PostTypes.UPDATE_POST_SUCCESS,
            isEndpointCalled: false,
            data: { newPost }
        });

        try {
            await axios(`/api/comment/${comment._id}/like`, {
                method: "patch",
                headers: {
                    Authorization: token
                }
            });
            socket.emit("likeComment", newPost);
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const unLikeComment = (post, comment, token, userInfo, socket) => {
    return async dispatch => {
        const newComments = post.comments.map(item => item._id === comment._id ?
            { ...comment, likes: comment.likes.filter(item => item._id !== userInfo._id) } : item);
        const newPost = { ...post, comments: [...newComments] }

        dispatch({
            type: PostTypes.UPDATE_POST_SUCCESS,
            isEndpointCalled: false,
            data: { newPost }
        });

        try {
            await axios(`/api/comment/${comment._id}/unlike`, {
                method: "patch",
                headers: {
                    Authorization: token
                }
            });
            socket.emit("unlikeComment", newPost);
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}


export const removeComment = (post, comment, token, socket) => {
    return async dispatch => {
        const deleteArr = [...post.comments.filter(item => item.reply === comment._id), comment];
        const newPost = { ...post, comments: post.comments.filter(cm => !deleteArr.find(de => cm._id === de._id)) };

        dispatch({
            type: PostTypes.UPDATE_POST_SUCCESS,
            isEndpointCalled: false,
            data: { newPost }
        });
        socket.emit("removeComment", newPost);

        try {
            deleteArr.forEach(item => {
                axios(`/api/comment/${item._id}`, {
                    method: "delete",
                    headers: {
                        Authorization: token
                    }
                });

                const msg = {
                    id: item._id,
                    recipients: item.reply ? item.tag._id : post.user._id,
                    url: `/post/${post._id}`,
                    text: "has commented on your post.",
                }
    
                dispatch(removeNotify(msg, token, socket));
            });
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}