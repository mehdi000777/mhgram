import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDiscoverPosts } from '../Redux/actions/postAction';
import loadIcon from '../images/Spinner-1s-204px.gif';
import PostThumb from '../Component/profile/PostThumb';
import LoadMoreBtn from '../Component/LoadMoreBtn';
import axios from 'axios';
import { PostTypes } from '../Redux/actionTypes/postTypes';

export default function Discover() {

    const [load, setLoad] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { token } = userLogin;

    const discover = useSelector(state => state.discover);
    const { loading, posts, result, firstLoad, page } = discover;

    const dispatch = useDispatch();

    useEffect(() => {
        if (!firstLoad) {
            dispatch(getDiscoverPosts(token));
        }
    }, [dispatch, token, firstLoad])

    const loadMoreHandler = async () => {
        setLoad(true);
        const res = await axios(`/api/post_discover?num=${page * 9}`, {
            method: "get",
            headers: {
                Authorization: token
            }
        });
        dispatch({ type: PostTypes.UPDATE_DISCOVER_POSTS, isEndpointCalled: false, data: res.data })
        setLoad(false);
    }

    return (
        <div>
            {
                loading ? <img src={loadIcon} alt="loading" className="d-block mx-auto my-4" />
                    : <PostThumb posts={posts} result={result} />
            }
            {
                load && <img src={loadIcon} alt="loading" className="d-block mx-auto" />
            }
            {
                !loading &&
                <LoadMoreBtn result={result} load={load} loadMoreHandler={loadMoreHandler} page={page} />
            }
        </div>
    )
}
