import React from 'react';
import { useSelector } from 'react-redux';

export default function LikeButton({ isLike, likeHandler, unLikeHandler }) {

    const theme = useSelector(state => state.theme);

    return (
        <>
            {
                isLike
                    ? <i onClick={unLikeHandler} className="fas fa-heart text-danger"
                        style={{ filter: theme ? "invert(1)" : "invert(0)" }}></i>
                    : <i onClick={likeHandler} className="far fa-heart"></i>
            }
        </>
    )
}
