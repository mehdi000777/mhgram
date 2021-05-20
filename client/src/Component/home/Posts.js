import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import loadIcon from '../../images/Spinner-1s-204px.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import axios from 'axios';
import { PostTypes } from '../../Redux/actionTypes/postTypes';

export default function Posts() {

    const [load, setLoad] = useState(false);

    const homePosts = useSelector(state => state.homePosts)
    const { posts, result, page } = homePosts;

    const userLogin = useSelector(state => state.userLogin)
    const { token } = userLogin;

    const dispatch = useDispatch();

    const loadMoreHandler = async () => {
        setLoad(true);

        const res = await axios(`/api/posts?limit=${page * 9}`, {
            method: "get",
            headers: {
                Authorization: token
            }
        })
        dispatch({ type: PostTypes.UPDATE_POST_PAGE, isEndpointCalled: false, data: res.data });

        setLoad(false);
    }

    return (
        <>
            <PostCard posts={posts} />

            {
                load && <img src={loadIcon} alt="loading" className="d-block mx-auto" />
            }

            <LoadMoreBtn result={result} load={load} loadMoreHandler={loadMoreHandler} page={page} />
        </>
    )
}
