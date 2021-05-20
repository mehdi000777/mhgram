import React, { useState, useEffect } from 'react';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import Avatar from '../Avatar';
import EditProfile from './EditProfile';
import FollowBtn from './FollowBtn'
import Followers from './Followers';
import Following from './Following';

export default function Info({ users, userLogin, id, dispatch }) {

    const [userData, setUserData] = useState([]);
    const [editProfile, setEditProfile] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const { userInfo, token } = userLogin;

    useEffect(() => {
        if (id === userInfo._id) {
            setUserData([userInfo]);
        }
        else {
            const newData = users.filter(user => user._id === id);
            setUserData(newData);
        }
    }, [dispatch, id, userInfo, token, users])

    useEffect(() => {
        if (showFollowers || showFollowing || editProfile) {
            dispatch({ type: GlobalyTypes.MODAL, isEndpointCalled: false, payLoad: true });
        }
        else {
            dispatch({ type: GlobalyTypes.MODAL, isEndpointCalled: false, payLoad: false });
        }
    }, [dispatch, showFollowers, showFollowing, editProfile])

    return (
        <div className="info">
            {userData.map(user => (
                <div key={user._id} className="info-container">
                    <Avatar src={user.avatar} size="supper-avatar" />
                    <div className="info-content">
                        <div className="info-content-title">
                            <h2>{user.username}</h2>
                            {
                                user._id === userInfo._id ?
                                    <button className="btn btn-outline-info" onClick={() => setEditProfile(true)}>
                                        Edit Profile</button>
                                    : <FollowBtn user={user} />
                            }

                        </div>
                        <div className="follow-btn">
                            <span className="me-4"
                                onClick={() => {
                                    setShowFollowers(true);
                                    setShowFollowing(false);
                                }}>
                                {user.followers.length} Followers
                            </span>
                            <span className="ms-4"
                                onClick={() => {
                                    setShowFollowing(true);
                                    setShowFollowers(false);
                                }}>
                                {user.following.length} Following
                            </span>
                        </div>
                        <h6>{user.fullname} <span className="text-danger">{user.mobile}</span></h6>
                        <p className="m-0">{user.address}</p>
                        <h6 className="m-0">{user.email}</h6>
                        <a href={user.website} target="_blank" rel="noreferrer">{user.website}</a>
                        <p>{user.story}</p>
                    </div>
                    {
                        editProfile && <EditProfile user={user} setEditProfile={setEditProfile} />
                    }
                    {
                        showFollowers && <Followers users={user.followers} setShowFollowers={setShowFollowers} />
                    }
                    {
                        showFollowing && <Following users={user.following} setShowFollowing={setShowFollowing} />
                    }
                </div>
            ))
            }
        </div >
    )
}
