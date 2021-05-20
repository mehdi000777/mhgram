import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router';
import UserCard from '../UserCard'
import MsgDisplay from './MsgDisplay';
import Icons from '../Icons';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import { imageShowe, videoShowe } from '../../Utils/mediaShow';
import { addMessage, deleteConversation, getMessages, loadMoreMessages } from '../../Redux/actions/messageAction';
import { imageUpload } from '../../Utils/imageUpload'
import LoadIcon from '../../images/Spinner-1s-204px.gif'

export default function RightSide() {

    const [user, setUser] = useState([]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState([]);
    const [LoadMedia, setLoadMedia] = useState(false);
    const [data, setData] = useState([]);
    const [result, setResult] = useState(9);
    const [page, setPage] = useState(0);
    const [isLoadMore, setIsLoadMore] = useState(0);

    const { id } = useParams();
    const history = useHistory();

    const refDisplay = useRef();
    const pageEnd = useRef();

    const { userLogin, message, theme, socket, peer } = useSelector(state => state);

    const dispatch = useDispatch();

    useEffect(() => {
        const newData = message.data.find(item => item._id === id);
        if (newData) {
            setData(newData.messages);
            setResult(newData.result);
            setPage(newData.page);
        }
    }, [message.data, id])

    useEffect(() => {
        if (id && message.users.length > 0) {
            setTimeout(() => {
                refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 50);

            const newUser = message.users.find(user => user._id === id);
            if (newUser) {
                setUser(newUser);
            }
        }
    }, [message.users, id])

    const mediaHandler = (e) => {
        const files = [...e.target.files];
        let err = "";
        let newMedia = [];

        files.forEach(file => {
            if (!file) {
                return err = "File does not exist.";
            }
            if (file.size > 1024 * 1024 * 5) {
                return err = "The file largest is 5mb.";
            }

            return newMedia.push(file);
        })

        if (err) return dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: err })

        return setMedia([...media, ...newMedia]);
    }

    const deleteMediaHandler = (index) => {
        const newArr = [...media];
        newArr.splice(index, 1);
        setMedia(newArr);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!text.trim() && media.length === 0) return;
        setText("");
        setMedia([]);
        setLoadMedia(true);

        let newArr = [];
        if (media.length > 0) newArr = await imageUpload(media);

        const msg = {
            sender: userLogin.userInfo._id,
            recipient: id,
            text,
            media: newArr,
            createdAt: new Date().toISOString()
        }
        setLoadMedia(false);

        await dispatch(addMessage(msg, userLogin, socket));
        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }

    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages(id, userLogin, page, message));
                setTimeout(() => {
                    refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
                }, 50);
            }
        }
        getMessagesData();
    }, [dispatch, id, userLogin, message, page]);

    //Load More

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1);
            }
        }, {
            threshold: 0.1
        });
        observer.observe(pageEnd.current);
    }, [setIsLoadMore])

    useEffect(() => {
        if (isLoadMore > 1) {
            if (result >= page * 9) {
                dispatch(loadMoreMessages({ id, userLogin, page: page + 1 }));
                setIsLoadMore(1);
            }
        }
    }, [dispatch, isLoadMore, page, result, id, userLogin])


    const deleteHandler = () => {
        if (window.confirm("Do you want to delete?")) {
            dispatch(deleteConversation(id, userLogin));
            history.push("/message");
        }
    }

    //Call

    const caller = ({ video }) => {
        const { _id, avatar, fullname, username } = user;

        const msg = {
            sender: userLogin.userInfo._id,
            recipient: _id,
            avatar, fullname, username, video
        }
        dispatch({
            type: GlobalyTypes.CALL,
            isEndpointCalled: false,
            data: msg
        })
    }

    const callUser = ({ video }) => {
        const { _id, avatar, fullname, username } = userLogin.userInfo;

        const msg = {
            sender: _id,
            recipient: user._id,
            avatar, fullname, username, video
        }
        if (peer._open) msg.peerId = peer._id;

        socket.emit("callUser", msg);
    }

    const audioCallHandler = () => {
        caller({ video: false });
        callUser({ video: false });
    }

    const videoCallHandler = () => {
        caller({ video: true });
        callUser({ video: true });
    }

    return (
        <>
            <div className="message_header">
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div>
                            <i className="fas fa-phone-alt"
                                style={{ cursor: "pointer" }} onClick={audioCallHandler}>
                            </i>
                            <i className="fas fa-video mx-3"
                                style={{ cursor: "pointer" }} onClick={videoCallHandler}>
                            </i>
                            <i className="fas fa-trash text-danger"
                                style={{ cursor: "pointer" }} onClick={deleteHandler}>
                            </i>
                        </div>
                    </UserCard>
                }
            </div>

            <div className="chat_container"
                style={{ height: media.length > 0 && "calc(100% - 180px)" }}>
                <div className="chat_display" ref={refDisplay}>
                    <button style={{ marginTop: "-25px", opacity: "0" }} ref={pageEnd}>Load More</button>
                    {
                        data.map((msg, index) => (
                            < div key={index} >
                                {
                                    msg.sender !== userLogin.userInfo._id &&
                                    <div className="chat_row other_message">
                                        <MsgDisplay user={user} msg={msg} theme={theme} />
                                    </div>
                                }

                                {
                                    msg.sender === userLogin.userInfo._id &&
                                    <div className="chat_row you_message">
                                        <MsgDisplay user={userLogin.userInfo} msg={msg} theme={theme} data={data} />
                                    </div>
                                }
                            </div>
                        ))
                    }
                    {
                        LoadMedia &&
                        <div className="chat_row you_message">
                            <img src={LoadIcon} alt="load" />
                        </div>
                    }
                </div>
            </div>

            {
                media.length > 0 &&
                <div className="show_media">
                    {
                        media.map((item, index) => (
                            <div key={index} className="file_media">
                                {
                                    item.type.match(/video/i)
                                        ? videoShowe(URL.createObjectURL(item), theme)
                                        : imageShowe(URL.createObjectURL(item), theme)
                                }
                                <span onClick={() => deleteMediaHandler(index)}>&times;</span>
                            </div>
                        ))
                    }
                </div>
            }

            <form className="chat_input" onSubmit={submitHandler}>
                <input type="text" placeholder="Enter your message..."
                    onChange={(e) => setText(e.target.value)} value={text}
                    style={{
                        filter: theme ? "invert(1)" : "invert(0)",
                        background: theme ? "#040404" : "",
                        color: theme ? "#fff" : ""
                    }} />

                <Icons setContent={setText} content={text} />

                <div className="file_upload">
                    <i className="fas fa-image text-danger"></i>
                    <input type="file" name="file" id="file" multiple accept="image/*,video/*" onChange={mediaHandler} />
                </div>

                <button type="submit" className="material-icons" disabled={(text || media.length > 0) ? false : true}>near_me</button>
            </form>
        </>
    )
}
