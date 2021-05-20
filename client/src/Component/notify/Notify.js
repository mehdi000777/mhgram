import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLoginReset } from '../../Redux/actions/userAction';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import { PostTypes } from '../../Redux/actionTypes/postTypes';
import { Types } from '../../Redux/actionTypes/userTypes';
import Loading from './Loading';
import Toast from './Toast';

export default function Notify() {

    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, success } = userLogin;

    const alert = useSelector(state => state.alert);
    const { msg } = alert;

    const updateProfile = useSelector(state => state.updateProfile);
    const { loading: loadingUpadate, success: successUpadate, error: errorUpadate } = updateProfile;

    const homePosts = useSelector(state => state.homePosts);
    const { loading: loadinghomePosts, success: successhomePosts, error: errorhomePosts } = homePosts;

    const dispatch = useDispatch();

    const handelShow = () => {
        dispatch(userLoginReset());
    }

    const handelShowAlert = () => {
        dispatch({ type: GlobalyTypes.ALERT_RESET, isEndpointCalled: false })
    }

    const handlelShowUpdate = () => {
        dispatch({ type: Types.USER_PROFILE_UPDATE_RESET, isEndpointCalled: false })
    }

    const handlelShowHomePosts = () => {
        dispatch({ type: PostTypes.CREATE_POST_RESET, isEndpointCalled: false })
    }

    return (
        <div>
            {loading && <Loading />}
            {error && <Toast msg={{ title: "Error", body: error }} bgColor="bg-danger"
                handelShow={handelShow} />}
            {success && <Toast msg={{ title: "Success", body: success }} bgColor="bg-success"
                handelShow={handelShow} />}

            {loadingUpadate && <Loading />}
            {errorUpadate && <Toast msg={{ title: "Error", body: errorUpadate }} bgColor="bg-danger"
                handelShow={handlelShowUpdate} />}
            {successUpadate && <Toast msg={{ title: "Success", body: successUpadate }} bgColor="bg-success"
                handelShow={handlelShowUpdate} />}

            {loadinghomePosts && <Loading />}
            {errorhomePosts && <Toast msg={{ title: "Error", body: errorhomePosts }} bgColor="bg-danger"
                handelShow={handlelShowHomePosts} />}
            {successhomePosts && <Toast msg={{ title: "Success", body: successhomePosts }} bgColor="bg-success"
                handelShow={handlelShowHomePosts} />}

            {msg && <Toast msg={{ title: "Error", body: msg }} bgColor="bg-danger" handelShow={handelShowAlert} />}
        </div>
    )
}
