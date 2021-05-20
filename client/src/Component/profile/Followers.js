import React from 'react';
import UserCard from '../UserCard';
import { useSelector } from 'react-redux';
import FollowBtn from './FollowBtn';

export default function Followers({ users, setShowFollowers }) {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    return (
        <div className="follow">
            <div className="follow-box">
                <h5 className="text-center">Followers</h5>
                <hr />
                <div className="follow_content">
                    {
                        users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowers={setShowFollowers}>
                                {
                                    userInfo._id !== user._id && <FollowBtn user={user} />
                                }
                            </UserCard>
                        ))
                    }
                </div>
                <div className="close" onClick={() => setShowFollowers(false)}>
                    &times;
                </div>
            </div>
        </div>
    )
}
