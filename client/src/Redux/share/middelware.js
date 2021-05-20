import axios from 'axios';

const baseURL = "/api/";

const handelSuccess = ({ response, type, next, userInfo, id }) => {
    next({
        data: response.data,
        createPostData: { ...response.data.newPost, user: userInfo },
        postData: { ...response.data, _id: id, page: 2 },
        type,
    });

    return new Promise((resolve, reject) => {
        resolve(response);
    })
}

const handelFaild = ({ error, type, next }) => {
    next({
        type,
        error: error.response && error.response.data.message
            ? error.response.data.message : error.message
    });

    return new Promise((resolve, reject) => {
        reject(error);
    })
}


const apiMiddleware = store => next => action => {

    const { isEndpointCalled, type } = action;

    if (isEndpointCalled) {
        next({ type });

        const { endpoint, method, successType, faildType, data = {}, headers = {}, userInfo = {}, id = {} } = action;

        return axios(`${baseURL}${endpoint}`, {
            method,
            data,
            headers
        })
            .then(response => handelSuccess({ response, type: successType, userInfo, id, next }))
            .catch(error => handelFaild({ error, type: faildType, next }));
    }
    else {
        next(action);
    }
}


export default apiMiddleware;