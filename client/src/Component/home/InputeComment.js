import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createComment } from '../../Redux/actions/commentAction';
import Icons from '../Icons';

export default function InputeComment({ children, post, onReply, setOnReply }) {

    const [content, setContent] = useState("");

    const userLogin = useSelector(state => state.userLogin);
    const { token, userInfo } = userLogin;

    const { socket, theme } = useSelector(state => state);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return;
        }

        setContent("");

        const newComment = {
            content,
            likes: [],
            user: userInfo,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        dispatch(createComment(post, newComment, token, userInfo, socket));
        if (setOnReply) return setOnReply(false);
    }

    return (
        <form className="card-footer comment-input" onSubmit={submitHandler}>
            {children}
            <input type="text" value={content} placeholder="Add your comments..."
                onChange={(e) => setContent(e.target.value)}
                style={{
                    filter: theme ? "invert(1)" : "invert(0)",
                    background: theme ? "rgba(0,0,0,.03)" : "",
                    color: theme ? "#fff" : "#111",
                }} />

            <Icons setContent={setContent} content={content} />
            <button type="submit" className="postBtn">
                Post
            </button>
        </form>
    )
}
