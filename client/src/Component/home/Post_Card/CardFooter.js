import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import send from '../../../images/send-svgrepo-com.svg';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, savePost, unLikePost, unSavePost } from '../../../Redux/actions/postAction';
import ShareModal from './ShareModal';
import { BASE_URL } from '../../../Utils/config';

export default function CardFooter({ post }) {

    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const [loadSave, setLoadSave] = useState(false);
    const [isShare, setIsShare] = useState(false);
    const [saved, setSaved] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, token } = userLogin;

    const theme = useSelector(state => state.theme);
    const socket = useSelector(state => state.socket);

    const dispatch = useDispatch();

    const likeHandler = async () => {
        if (loadLike) return;

        setLoadLike(true);
        await dispatch(likePost({ post, userInfo, token, socket }));
        setLoadLike(false);
    }

    const unLikeHandler = async () => {
        if (loadLike) return;

        setLoadLike(true);
        await dispatch(unLikePost({ post, userInfo, token, socket }));
        setLoadLike(false);
    }

    useEffect(() => {
        if (post.likes.find(item => item._id === userInfo._id)) {
            setIsLike(true)
        }
        else {
            setIsLike(false)
        }
    }, [post.likes, userInfo._id])

    const savedHandler = async () => {
        if (loadSave) return;

        setLoadSave(true);
        await dispatch(savePost(token, userInfo, post));
        setLoadSave(false);
    }

    const unSavedHandler = async () => {
        if (loadSave) return;

        setLoadSave(true);
        await dispatch(unSavePost(token, userInfo, post));
        setLoadSave(false);
    }

    useEffect(() => {
        if (userInfo.saved.find(id => id === post._id)) {
            setSaved(true)
        }
        else {
            setSaved(false)
        }
    }, [userInfo.saved, post._id])

    return (
        <div className="card_footer">
            <div className="card_icon_menu">
                <div>
                    <LikeButton isLike={isLike} likeHandler={likeHandler} unLikeHandler={unLikeHandler} />
                    <Link to={`/post/${post._id}`} className="text-dark">
                        <i className="far fa-comment"></i>
                    </Link>
                    <img src={send} alt="Send" onClick={() => setIsShare(!isShare)} />
                </div>
                {
                    saved
                        ? <i className="fas fa-bookmark text-info"
                            onClick={unSavedHandler}></i>
                        : <i className="far fa-bookmark"
                            onClick={savedHandler}></i>
                }
            </div>
            <div className="d-flex justify-content-between">
                <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
                    {post.likes.length} likes
                </h6>
                <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
                    {post.comments.length} comments
                </h6>
            </div>
            {
                isShare &&
                <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
            }
        </div>
    )
}
