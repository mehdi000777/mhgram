import moment from 'moment';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NoNotice from '../../images/download.png'
import { deleteAllNotifies, isReadNotify } from '../../Redux/actions/notifyAction';
import { notifyTypes } from '../../Redux/actionTypes/notifyTypes';
import Avatar from '../Avatar';

export default function NotifyModal() {

    const notify = useSelector(state => state.notify)
    const { notifies, sound } = notify;

    const userLogin = useSelector(state => state.userLogin)

    const dispatch = useDispatch();

    const isReadHandler = (msg) => {
        dispatch(isReadNotify(msg, userLogin.token));
    }

    const soundHandler = () => {
        dispatch({ type: notifyTypes.UPDATE_SOUND, isEndpointCalled: false, notify: !sound })
    }

    const deleteAllHandler = () => {
        dispatch(deleteAllNotifies(userLogin.token));
    }

    return (
        <div style={{ minWidth: "300px" }}>
            <div className="d-flex justify-content-between align-items-center px-3">
                <h3>Notifiction</h3>
                {
                    sound
                        ? <i className="fas fa-bell text-danger" onClick={soundHandler}
                            style={{ fontSize: "1.2rem", cursor: "pointer" }}></i>
                        : <i className="fas fa-bell-slash text-danger" onClick={soundHandler}
                            style={{ fontSize: "1.2rem", cursor: "pointer" }}></i>
                }
            </div>
            <hr className="mt-0" />
            {
                notifies.length === 0 &&
                <img src={NoNotice} alt="NoNotice" className="w-100" />
            }
            <div style={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
                {
                    notifies.map((msg, index) => (
                        <div key={index} className="px-2 mb-3">
                            <Link to={msg.url} className="d-flex text-dark align-items-center"
                                onClick={() => isReadHandler(msg)}>
                                <Avatar src={msg.user.avatar} size="big-avatar" />
                                <div className="mx-1 flex-fill">
                                    <div>
                                        <strong className="me-1">{msg.user.username}</strong>
                                        <span>{msg.text}</span>
                                    </div>
                                    {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                                </div>
                                <div style={{ width: "30px" }}>
                                    {msg.image && <Avatar src={msg.image} size="medium-avatar" />}
                                </div>
                            </Link>
                            <small className="text-mute d-flex justify-content-between px-2">
                                {moment(msg.createdAt).fromNow()}
                                {
                                    !msg.isRead && <i className="fas fa-circle text-primary"></i>
                                }
                            </small>
                        </div>
                    ))
                }
            </div>
            <hr className="my-2" />
            <div className="text-end text-danger me-2" style={{ cursor: "pointer" }}
                onClick={deleteAllHandler}>
                Delete All
            </div>
        </div>
    )
}
