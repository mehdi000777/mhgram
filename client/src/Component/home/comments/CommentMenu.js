import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeComment } from '../../../Redux/actions/commentAction';

export default function CommentMenu({ post, comment, userInfo, token, setOnEdit }) {

    const socket = useSelector(state => state.socket);

    const dispatch = useDispatch();

    const removeHandler = () => {
        if (post.user._id === userInfo._id || comment.user._id === userInfo._id) {
            dispatch(removeComment(post, comment, token, socket));
        }
    }

    const MenuItems = () => {
        return (
            <>
                <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                    <span className="material-icons">create</span> Edit
                </div>
                <div className="dropdown-item" onClick={removeHandler}>
                    <span className="material-icons">delete_outline</span> Remove
                </div>
            </>
        )
    }

    return (
        <div className="menu">
            {
                (post.user._id === userInfo._id || comment.user._id === userInfo._id) &&
                <div className="nav-item dropdown">
                    <span className="material-icons" id="moreLink" data-bs-toggle="dropdown">
                        more_vert
                    </span>
                    <div className="dropdown-menu" aria-labelledby="moreLink">
                        {
                            post.user._id === userInfo._id
                                ? comment.user._id === userInfo._id
                                    ? MenuItems()
                                    : <div className="dropdown-item" onClick={removeHandler}>
                                        <span className="material-icons">delete_outline</span> Remove
                            </div>
                                : comment.user._id === userInfo._id && MenuItems()
                        }
                    </div>
                </div>
            }
        </div>
    )
}
