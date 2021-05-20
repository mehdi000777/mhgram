import React from 'react';
import Avatar from '../../../Component/Avatar';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalyTypes } from '../../../Redux/actionTypes/globalTypes';
import { deletePost } from '../../../Redux/actions/postAction';
import { BASE_URL } from '../../../Utils/config';

export default function CardHeader({ post }) {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, token } = userLogin;

    const socket = useSelector(state => state.socket)

    const dispatch = useDispatch();

    const editHandler = () => {
        dispatch({ type: GlobalyTypes.STATUS, isEndpointCalled: false, payLoad: { ...post, onEdit: true } })
    }

    const history = useHistory();

    const deleteHandler = () => {
        if (window.confirm("Are you sure want to delete this post ?")) {
            dispatch(deletePost(token, post, socket));
            return history.push("/");
        }
    }

    const copyHandler = () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
    }

    return (
        <div className="card_header">
            <div className="d-flex">
                <Avatar src={post.user.avatar} size="big-avatar" />
                <div className="card_name">
                    <h6 className="m-0">
                        <Link to={`/profile/${post.user._id}`} className="text-dark">
                            {post.user.username}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>
            </div>
            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-bs-toggle="dropdown">
                    more_horiz
                </span>
                <div className="dropdown-menu">
                    {
                        userInfo._id === post.user._id &&
                        <>
                            <div className="dropdown-item" onClick={editHandler}>
                                <span className="material-icons">create</span> Edit Post
                            </div>
                            <div className="dropdown-item" onClick={deleteHandler}>
                                <span className="material-icons">delete_outline</span> Remove Post
                            </div>
                        </>
                    }
                    <div className="dropdown-item" onClick={copyHandler}>
                        <span className="material-icons">content_copy</span> Copy Link
                    </div>
                </div>
            </div>
        </div>
    )
}
