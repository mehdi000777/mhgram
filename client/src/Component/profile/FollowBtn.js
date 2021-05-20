import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { follow, unFollow } from '../../Redux/actions/userAction';

export default function FollowBtn({ user }) {

    const [followed, setFollowed] = useState(false);
    const [loadFollowed, setLoadFollowed] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, token } = userLogin;

    const profile = useSelector(state => state.profile);
    const { users } = profile;

    const socket = useSelector(state => state.socket);

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo.following.find(item => item._id === user._id)) {
            setFollowed(true);
        }
        return () => setFollowed(false);
    }, [userInfo.following, user._id])

    const followedHandler = () => {
        if (loadFollowed) return;
        setFollowed(true);
        setLoadFollowed(true);
        dispatch(follow(users, userInfo, user, token, socket));
        setLoadFollowed(false);
    }

    const unFollowedHandler = () => {
        if (loadFollowed) return;
        setFollowed(false);
        setLoadFollowed(true);
        dispatch(unFollow(users, userInfo, user, token, socket));
        setLoadFollowed(false);
    }

    return (
        <>
            {
                !followed ? <button className="btn btn-outline-info" onClick={followedHandler}>Follow</button>
                    :
                    <button className="btn btn-outline-danger" onClick={unFollowedHandler}>
                        Unfollow
                    </button>
            }
        </>
    )
}
