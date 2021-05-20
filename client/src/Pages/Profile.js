import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Info from '../Component/profile/Info';
import Post from '../Component/profile/Post';
import loadIcon from '../images/Spinner-1s-204px.gif';
import { useParams } from 'react-router-dom';
import { userProfile } from '../Redux/actions/userAction';
import Saved from '../Component/profile/Saved';

export default function Profile() {

    const [saveTab, setSaveTab] = useState(false);

    const { id } = useParams();

    const profile = useSelector(state => state.profile);
    const { loading, users, ids, userPosts } = profile;

    const userLogin = useSelector(state => state.userLogin);
    const { token, userInfo } = userLogin;

    const dispatch = useDispatch();

    useEffect(() => {
        if (ids.every(item => item !== id)) {
            dispatch(userProfile(id, token));
        }
    }, [dispatch, token, ids, id])

    return (
        <div className="profile">

            <Info dispatch={dispatch} userLogin={userLogin} users={users} id={id} />
            {
                userInfo._id === id &&
                <div className="profile_tab">
                    <button className={saveTab ? "" : "active"} onClick={() => setSaveTab(false)}>Posts</button>
                    <button className={saveTab ? "active" : ""} onClick={() => setSaveTab(true)}>Saved</button>
                </div>
            }
            {
                loading ? <img src={loadIcon} className="d-block mx-auto my-4" alt="loading" /> :
                    <>
                        {
                            saveTab
                                ? <Saved userLogin={userLogin} dispatch={dispatch} />
                                : <Post dispatch={dispatch} userLogin={userLogin} userPosts={userPosts} id={id} />
                        }
                    </>
            }
        </div>
    )
}
