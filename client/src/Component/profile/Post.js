import React, { useEffect, useState } from 'react'
import LoadMoreBtn from '../LoadMoreBtn';
import PostThumb from './PostThumb';
import loadIcon from '../../images/Spinner-1s-204px.gif';
import axios from 'axios';
import { Types } from '../../Redux/actionTypes/userTypes';

export default function Post({ dispatch, id, userLogin, userPosts }) {

    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState(9);
    const [page, setPage] = useState(2);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        userPosts.forEach(data => {
            if (data._id === id) {
                setPosts(data.posts);
                setResult(data.result);
                setPage(data.page);
            }
        });
    }, [userPosts, id])

    const loadMoreHandler = async () => {
        setLoad(true);

        const res = await axios(`/api/user_posts/${id}?limit=${page * 9}`, {
            method: "get",
            headers: {
                Authorization: userLogin.token
            }
        })
        dispatch({
            type: Types.PROFILE_UPDATE_PAGE,
            isEndpointCalled: false,
            newPost: { ...res.data, _id: id, page: page + 1 }
        })

        setLoad(false);
    }

    return (
        <div>
            <PostThumb posts={posts} result={result} />

            {
                load && <img src={loadIcon} alt="loading" className="d-block mx-auto" />
            }

            <LoadMoreBtn result={result} load={load} loadMoreHandler={loadMoreHandler} page={page} />
        </div>
    )
}
