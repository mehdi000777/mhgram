import React from 'react'
import Avatar from '../Avatar'
import { imageShowe, videoShowe } from '../../Utils/mediaShow';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessage } from '../../Redux/actions/messageAction';
import Times from './Times';

export default function MsgDisplay({ user, msg, theme, data }) {

    const userLogin = useSelector(state => state.userLogin);

    const dispatch = useDispatch();

    const deleteHandler = () => {
        if (!data) return;
        if (window.confirm("Do you want to delete?")) {
            dispatch(deleteMessage(msg, data, userLogin));
        }
    }

    return (
        <>
            <div className="chat_title">
                <Avatar src={user.avatar} size="small-avatar" />
            </div>

            <div className="you_content">
                {
                    userLogin.userInfo._id === user._id &&
                    <i className="fas fa-trash text-danger" onClick={deleteHandler}></i>
                }
                <div>
                    {
                        msg.text &&
                        <div className="chat_text" style={{ filter: theme ? "invert(1)" : "invert(0)" }}>
                            {msg.text}
                        </div>
                    }
                    {
                        msg.media &&
                        msg.media.map((item, index) => (
                            <div key={index}>
                                {
                                    item.url.match(/video/i)
                                        ? videoShowe(item.url, theme)
                                        : imageShowe(item.url, theme)
                                }
                            </div>
                        ))
                    }

                </div>
                {
                    msg.call &&
                    <div className="btn d-flex align-items-center py-3"
                        style={{ background: "#eee", borderRadius: "10px" }}>
                        <span className="material-icons font-weight-bold me-1"
                            style={{
                                fontSize: "2.5rem", color: msg.call.times === 0 ? "crimson" : "green",
                                filter: theme ? "invert(1)" : "invert(0)"
                            }}>
                            {
                                msg.call.times === 0
                                    ? msg.call.video ? "videocam_off" : "phone_disabled"
                                    : msg.call.video ? "video_camera_front" : "call"
                            }
                        </span>
                        <div className="text-left">
                            <h6>{msg.call.video ? "Video call" : "Audio call"}</h6>
                            <small>
                                {
                                    msg.call.times > 0
                                        ? <Times total={msg.call.times} />
                                        : new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>
                    </div>
                }
            </div>

            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </>
    )
}
