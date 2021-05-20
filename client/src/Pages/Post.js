import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPostDtails } from '../Redux/actions/postAction';
import loadIcon from '../images/Spinner-1s-204px.gif';
import PostCard from '../Component/PostCard';

export default function Post() {

    const { id } = useParams()

    const [postDt, setPostDt] = useState([]);
    console.log(postDt);

    const userLogin = useSelector(state => state.userLogin);
    const { token } = userLogin;

    const post = useSelector(state => state.post);
    const { postDtails } = post;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPostDtails(postDtails, id, token));
        if (postDtails.length > 0) {
            const newArr = postDtails.filter(item => item._id === id);
            setPostDt(newArr);
        }
    }, [dispatch, id, token, postDtails]);

    return (
        <div className="posts">
            {
                postDt.length === 0 &&
                <img src={loadIcon} className="d-block mx-auto my-4" alt="loading" />
            }

            <PostCard posts={postDt} />
        </div>
    )
}
