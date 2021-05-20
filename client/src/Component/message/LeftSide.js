import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import UserCard from '../UserCard';
import loadIcon from '../../images/Spinner-1s-204px.gif';
import { useHistory, useParams } from 'react-router';
import { addUser } from '../../Redux/actions/messageAction';
import axios from 'axios';
import { getConversation } from '../../Redux/actions/messageAction';
import { messageTypes } from '../../Redux/actionTypes/messageTypes';

export default function LeftSide() {

    const [search, setSearch] = useState("");
    const [load, setLoad] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);

    const history = useHistory();

    const { id } = useParams();

    const pageEnd = useRef();

    const userLogin = useSelector(state => state.userLogin);
    const { token, userInfo } = userLogin;

    const { message, theme, online } = useSelector(state => state);

    const dispatch = useDispatch();

    const closeSearchHandler = () => {
        setUsers([]);
        setSearch("")
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!search) return;

        try {
            setLoad(true);
            const response = await axios(`/api/search?username=${search}`, {
                method: "get",
                headers: {
                    Authorization: token
                }
            });
            setUsers(response.data.users);
            setLoad(false);
        }
        catch (error) {
            console.log(error.response.message);
        }
    }

    const userAddHandler = (user) => {
        setSearch("");
        setUsers([]);
        dispatch(addUser(user, message));
        dispatch({
            type: messageTypes.USER_ONLINE_OFFLINE,
            isEndpointCalled: false,
            data: online
        })
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if (id === user._id) return "active";
        return "";
    }

    useEffect(() => {
        if (message.firstLoad) return;
        dispatch(getConversation(token, userInfo, page));
    }, [dispatch, message.firstLoad, token, userInfo, page])

    //Load More

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1);
            }
        }, {
            threshold: 0.1
        });
        observer.observe(pageEnd.current);
    }, [setPage])

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
            dispatch(getConversation(token, userInfo, page));
        }
    }, [dispatch, message.resultUsers, page, token, userInfo])

    useEffect(() => {
        if (message.firstLoad) {
            dispatch({
                type: messageTypes.USER_ONLINE_OFFLINE,
                isEndpointCalled: false,
                data: online
            })
        }
    }, [message.firstLoad, online, dispatch])

    return (
        <>
            <form className="message_header" onSubmit={submitHandler}>
                <input type="text" value={search} placeholder="Enter to search..."
                    onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" className="search">Search</button>
                <div className="close-search" style={{ opacity: users.length === 0 ? "0" : "1" }} onClick={closeSearchHandler}>
                    &times;
                </div>
            </form>

            <div className="message_chat_list">
                {load && <img src={loadIcon} alt="load" className="d-block mx-auto" />}

                {
                    search.length > 0
                        ? users.map(user => (
                            <div key={user._id} className={`message_user ${isActive(user)}`} onClick={() => userAddHandler(user)}>
                                <UserCard user={user} />
                            </div>
                        ))
                        : message.users.map(user => (
                            <div key={user._id} className={`message_user ${isActive(user)}`} onClick={() => userAddHandler(user)}>
                                <UserCard user={user} msg={true} theme={theme}>
                                    {
                                        user.online
                                            ? <i className="fas fa-circle text-success"></i>
                                            : userInfo.followers.find(item => item._id === user._id) &&
                                            <i className="fas fa-circle"></i>
                                    }
                                </UserCard>
                            </div>
                        ))
                }
                <button style={{ opacity: "0" }} ref={pageEnd}>Load More</button>
            </div>
        </>
    )
}
