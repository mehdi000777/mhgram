import React from 'react';
import UserCard from '../UserCard';
import { useDispatch, useSelector } from 'react-redux';
import loadIcon from '../../images/Spinner-1s-204px.gif';
import FollowBtn from '../profile/FollowBtn';
import { suggestionsUser } from '../../Redux/actions/userAction';

export default function RightSideBar() {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, token } = userLogin;

    const suggestion = useSelector(state => state.suggestion);
    const { users, loading } = suggestion;

    const dispatch = useDispatch();

    return (
        <div className="suggestion">
            <UserCard user={userInfo} />
            <div className="d-flex justify-content-between align-items-center my-2">
                <h5 className="text-danger">Suggestion fore you</h5>
                <i className="fas fa-redo" style={{ cursor: "pointer" }}
                    onClick={() => dispatch(suggestionsUser(token))}></i>
            </div>
            <div>
                {
                    loading ? <img src={loadIcon} alt="loading" className="d-block mx-auto my-4" /> :
                        users.map(user => (
                            <UserCard key={user._id} user={user}>
                                <FollowBtn user={user} />
                            </UserCard>
                        ))
                }
            </div>
        </div>
    )
}
