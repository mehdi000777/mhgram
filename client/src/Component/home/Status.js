import React from 'react';
import Avatar from '../Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';

export default function Status() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    const dispatch = useDispatch();

    const statusHandler = () => {
        dispatch({ type: GlobalyTypes.STATUS, isEndpointCalled: false, payLoad: true });
    }

    return (
        <div className="status my-3">
            <Avatar src={userInfo.avatar} size="big-avatar" />
            <button onClick={statusHandler}>
                {userInfo.username}, what are you thinking?
            </button>
        </div>
    )
}
