import { PostTypes } from '../actionTypes/postTypes';
import { Types } from '../actionTypes/userTypes';
import { GlobalyTypes } from '../actionTypes/globalTypes';
import { imageUpload } from '../../Utils/imageUpload';
import axios from 'axios';
import { createNotify, removeNotify } from './notifyAction';

export const createPost = ({ images, content, token, userInfo, socket }) => {
    return async dispatch => {
        dispatch({ type: PostTypes.CREATE_POST, isEndpointCalled: false })
        let media = [];
        if (images.length > 0) media = await imageUpload(images);
        dispatch({
            type: PostTypes.CREATE_POST,
            successType: PostTypes.CREATE_POST_SUCCESS,
            faildType: PostTypes.CREATE_POST_FAILD,
            isEndpointCalled: true,
            endpoint: "posts",
            method: "Post",
            userInfo,
            data: {
                images: media,
                content
            },
            headers: {
                Authorization: token
            }
        }).then(res => {
            const msg = {
                id: res.data.newPost._id,
                recipients: res.data.newPost.user.followers,
                url: `/post/${res.data.newPost._id}`,
                text: "added a new post.",
                content,
                image: media[0].url
            }

            dispatch(createNotify(msg, token, userInfo, socket));
        })
    }
}

export const getPosts = (token) => {
    return {
        type: PostTypes.GET_POST,
        successType: PostTypes.GET_POST_SUCCESS,
        faildType: PostTypes.GET_POST_FAILD,
        isEndpointCalled: true,
        endpoint: "posts",
        method: "Get",
        headers: {
            Authorization: token
        }
    }
}

export const editPosts = ({ images, content, token, status }) => {
    return async dispatch => {
        let media = [];
        const imgNewUrl = images.filter(img => !img.url);
        const imgOldUrl = images.filter(img => img.url);

        if (content === status.content
            && imgNewUrl.length === 0
            && imgOldUrl.length === status.images.length)
            return;

        dispatch({ type: PostTypes.UPDATE_POST, isEndpointCalled: false });
        if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

        dispatch({
            type: PostTypes.UPDATE_POST,
            successType: PostTypes.UPDATE_POST_SUCCESS,
            faildType: PostTypes.UPDATE_POST_FAILD,
            isEndpointCalled: true,
            endpoint: `post/${status._id}`,
            method: "Patch",
            data: {
                images: [...imgOldUrl, ...media],
                content
            },
            headers: {
                Authorization: token
            }
        });
    }
}

export const likePost = ({ post, userInfo, token, socket }) => {
    return async dispatch => {
        const newPost = { ...post, likes: [...post.likes, userInfo] }
        dispatch({ type: PostTypes.UPDATE_POST_SUCCESS, isEndpointCalled: false, data: { newPost } });

        socket.emit("likePost", newPost);

        try {
            await axios(`/api/post/${post._id}/like`, {
                method: "patch",
                headers: { Authorization: token }
            });

            const msg = {
                id: userInfo._id,
                recipients: [post.user._id],
                url: `/post/${post._id}`,
                text: "Like your post.",
                content: post.content,
                image: post.images[0].url
            }

            dispatch(createNotify(msg, token, userInfo, socket));
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const unLikePost = ({ post, userInfo, token, socket }) => {
    return async dispatch => {
        const newPost = { ...post, likes: post.likes.filter(item => item._id !== userInfo._id) }
        dispatch({ type: PostTypes.UPDATE_POST_SUCCESS, isEndpointCalled: false, data: { newPost } });

        socket.emit("unLikePost", newPost);

        try {
            await axios(`/api/post/${post._id}/unlike`, {
                method: "patch",
                headers: { Authorization: token }
            });

            const msg = {
                id: userInfo._id,
                recipients: post.user._id,
                url: `/post/${post._id}`,
                text: "like your post.",
            }

            dispatch(removeNotify(msg, token, socket));
        }
        catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const getPostDtails = (postDtails, id, token) => {
    return dispatch => {
        if (postDtails.every(post => post._id !== id)) {
            dispatch({
                type: PostTypes.POST_DTAILS,
                successType: PostTypes.POST_DTAILS_SUCCESS,
                faildType: PostTypes.POST_DTAILS_FAILD,
                isEndpointCalled: true,
                endpoint: `post/${id}`,
                method: "get",
                headers: {
                    Authorization: token
                }
            })
        }
    }
}

export const getDiscoverPosts = (token) => {
    return {
        type: PostTypes.GET_DISCOVER_POSTS,
        successType: PostTypes.GET_DISCOVER_POSTS_SUCCESS,
        faildType: PostTypes.GET_DISCOVER_POSTS_FAILD,
        isEndpointCalled: true,
        endpoint: "post_discover",
        method: "get",
        headers: {
            Authorization: token
        }
    }
}

export const deletePost = (token, post, socket) => {
    return async dispatch => {
        dispatch({
            type: PostTypes.DELETE_POST,
            isEndpointCalled: false,
            post
        });

        try {
            const res = await axios(`/api/post/${post._id}`, {
                method: "delete",
                headers: {
                    Authorization: token
                }
            })

            const msg = {
                id: post._id,
                recipients: res.data.newPost.user.followers,
                url: `/post/${post._id}`,
                text: "added a new post.",
            }

            dispatch(removeNotify(msg, token, socket));
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}


export const savePost = (token, userInfo, post) => {
    return async dispatch => {
        const newUser = { ...userInfo, saved: [...userInfo.saved, post._id] };
        dispatch({
            type: Types.USER_LOGIN_SUCCESS,
            isEndpointCalled: false,
            data: {
                access_token: token,
                user: newUser
            }
        })
        try {
            await axios(`/api/savePost/${post._id}`, {
                method: "patch",
                headers: {
                    Authorization: token
                }
            })
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}

export const unSavePost = (token, userInfo, post) => {
    return async dispatch => {
        const newUser = { ...userInfo, saved: userInfo.saved.filter(id => id !== post._id) };
        dispatch({
            type: Types.USER_LOGIN_SUCCESS,
            isEndpointCalled: false,
            data: {
                access_token: token,
                user: newUser
            }
        })
        try {
            await axios(`/api/unSavePost/${post._id}`, {
                method: "patch",
                headers: {
                    Authorization: token
                }
            })
        } catch (error) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
        }
    }
}
