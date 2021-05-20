import React from 'react';
import UserCard from '../UserCard';
import { useSelector } from 'react-redux';
import FollowBtn from './FollowBtn';

export default function Following({ users, setShowFollowing }) {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    return (
        <div className="follow">
            <div className="follow-box">
                <h5 className="text-center">Following</h5>
                <hr />
                <div className="follow_content">
                    {
                        users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing}>
                                {
                                    userInfo._id !== user._id && <FollowBtn user={user} />
                                }
                            </UserCard>
                        ))
                    }
                </div>
                <div className="close" onClick={() => setShowFollowing(false)}>
                    &times;
                </div>
            </div>
        </div>
    )
}

