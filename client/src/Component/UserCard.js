import React from 'react'
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

export default function UserCard({ children, user, border, closeSearchHandler, setShowFollowers, setShowFollowing, msg, theme }) {

    const closeHandler = () => {
        if (closeSearchHandler) closeSearchHandler();
        if (setShowFollowers) setShowFollowers(false);
        if (setShowFollowing) setShowFollowing(false);
    }

    const msgShow = (user) => {
        return (
            <>
                {
                    user.call &&
                    <div className="material-icons"
                        style={{ filter: theme ? "invert(1)" : "invert(0)" }}>
                        {
                            user.call.times === 0
                                ? user.call.video ? "videocam_off" : "phone_disabled"
                                : user.call.video ? "video_camera_front" : "call"
                        }
                    </div>
                }
                {
                    user.text &&
                    <div style={{ filter: theme ? "invert(1)" : "invert(0)" }}>{user.text}</div>
                }
                {
                    user.media &&
                    user.media.length > 0 &&
                    <div>{user.media.length} <i className="fas fa-image"></i></div>
                }
            </>
        )
    }

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link to={`/profile/${user._id}`} onClick={closeHandler}
                    className="d-flex align-items-center">
                    <Avatar src={user.avatar} size="big-avatar" />
                    <div className="ml-1">
                        <span className="d-block">{user.username}</span>
                        <small style={{ opacity: ".7" }} >
                            {
                                msg
                                    ? msgShow(user)
                                    : user.fullname
                            }
                        </small>
                    </div>
                </Link>
            </div>
            { children}
        </div >
    )
}
