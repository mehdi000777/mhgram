import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../../Avatar';
import moment from 'moment';
import LikeButton from '../../LikeButton';
import CommentMenu from './CommentMenu';
import { updateComment, likeComment, unLikeComment } from '../../../Redux/actions/commentAction';
import InputeComment from '../InputeComment';

export default function CommentCard({ children, comment, post, commentId }) {

    const [content, setContent] = useState("");
    const [readMore, setReadMore] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [likeLoad, setLikeLoad] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [onReply, setOnReply] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, token } = userLogin;

    const { socket, theme } = useSelector(state => state);

    const dispatch = useDispatch();

    useEffect(() => {
        setContent(comment.content);
        setIsLike(false);
        setOnReply(false);
        if (comment.likes.find(item => item._id === userInfo._id)) {
            setIsLike(true);
        }
    }, [comment, userInfo._id]);

    const styleCard = {
        opacity: comment._id ? "1" : ".5",
        pointerEvent: comment._id ? "inherit" : "none"
    }

    const updateHandler = () => {
        if (comment.content !== content) {
            dispatch(updateComment(post, comment, content, token, socket));
            setOnEdit(false);
        }
        else {
            setOnEdit(false);
        }
    }

    const likeHandler = async () => {
        if (likeLoad) return;

        setIsLike(true);

        setLikeLoad(true);
        await dispatch(likeComment(post, comment, token, userInfo, socket))
        setLikeLoad(false);
    }

    const unLikeHandler = async () => {
        if (likeLoad) return;

        setIsLike(false);

        setLikeLoad(true);
        await dispatch(unLikeComment(post, comment, token, userInfo, socket));
        setLikeLoad(false);
    }

    const replyHandler = () => {
        if (onReply) return setOnReply(false);
        setOnReply({ ...comment, commentId });
    }

    return (
        <div className="comment_card mt-2" style={styleCard}>
            <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
                <Avatar src={comment.user.avatar} size="small-avatar" />
                <h6>{comment.user.username}</h6>
            </Link>
            <div className="comment_content">
                <div className="flex-fill"
                    style={{
                        filter: theme ? "invert(1)" : "invert(0)",
                        color: theme ? "#fff" : "#111",
                    }}>
                    {
                        onEdit ?
                            <textarea rows="5" value={content} onChange={(e) => setContent(e.target.value)} />
                            : <div>
                                <span>
                                    {
                                        comment.tag && comment.tag._id !== comment.user._id &&
                                        <Link to={`/profile/${comment.tag._id}`} className="me-1">
                                            @{comment.tag.username}
                                        </Link>
                                    }
                                    {
                                        content.length < 100 ? content :
                                            readMore ? content + " " : content.slice(0, 100) + ".... "
                                    }
                                </span>
                                {
                                    content.length > 100 &&
                                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                                        {readMore ? "Hide content" : "Read more"}
                                    </span>
                                }
                            </div>
                    }
                    <div style={{ cursor: "pointer" }}>
                        <small className="text-muted me-3">
                            {moment(comment.createdAt).fromNow()}
                        </small>
                        <small className="fw-bold me-3">
                            {comment.likes.length} likes
                            </small>
                        {
                            onEdit
                                ? <>
                                    <small className="fw-bold me-3" onClick={updateHandler}>
                                        update
                                        </small>
                                    <small className="fw-bold me-3" onClick={() => setOnEdit(false)}>
                                        cancel
                                         </small>
                                </>
                                : <small className="fw-bold me-3" onClick={replyHandler}>
                                    {onReply ? "cancel" : "reply"}
                                </small>
                        }
                    </div>
                </div>
                <div className="d-flex align-items-center mx-2" style={{ cursor: "pointer" }}>
                    <CommentMenu post={post} comment={comment} userInfo={userInfo} token={token} setOnEdit={setOnEdit} />
                    <LikeButton isLike={isLike} likeHandler={likeHandler} unLikeHandler={unLikeHandler} />
                </div>
            </div>
            {
                onReply &&
                <InputeComment post={post} onReply={onReply} setOnReply={setOnReply} >
                    <Link to={`/profile/${onReply.user._id}`} className="me-1">
                        @{onReply.user.username}:
                    </Link>
                </InputeComment>
            }
            {children}
        </div>
    )
}
