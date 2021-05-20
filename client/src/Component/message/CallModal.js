import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../Avatar';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import { addMessage } from '../../Redux/actions/messageAction';
import callRing from '../../audio/client_src_audio_ringring.mp3';

export default function CallModal() {

    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [second, setSecond] = useState(0);
    const [total, setTotal] = useState(0);
    const [answer, setAnswer] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [newCall, setNewCall] = useState(null);

    const yourVideo = useRef();
    const otherVideo = useRef();

    const { userLogin, call, peer, socket, theme } = useSelector(state => state);

    const dispatch = useDispatch();

    //Call
    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1);
            setTimeout(setTime, 1000);
        }
        setTime();
        return () => setTotal(0);
    }, [])

    useEffect(() => {
        setSecond(total % 60);
        setMins(parseInt(total / 60));
        setHours(parseInt(total / 3600));
    }, [total])

    //End Call
    const addCallMessage = useCallback((call, times, disconnect) => {
        if (call.recipient !== userLogin.userInfo._id || disconnect) {
            const msg = {
                sender: call.sender,
                recipient: call.recipient,
                text: "",
                media: [],
                call: { video: call.video, times },
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage(msg, userLogin, socket));
        }
    }, [userLogin, dispatch, socket])

    useEffect(() => {
        if (answer) {
            setTotal(0);
        }
        else {
            const timer = setTimeout(() => {
                socket.emit("endCall", { ...call, times: 0 });
                addCallMessage(call, 0);
                if (newCall) newCall.close();

                dispatch({
                    type: GlobalyTypes.CALL,
                    isEndpointCalled: false,
                    data: null
                })
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, answer, call, tracks, socket, addCallMessage, newCall])

    const endCallHandler = () => {
        if (tracks) {
            tracks.forEach(track => track.stop());
        }

        let times = answer ? total : 0;
        socket.emit("endCall", { ...call, times });
        addCallMessage(call, times);
        if (newCall) newCall.close();

        dispatch({
            type: GlobalyTypes.CALL,
            isEndpointCalled: false,
            data: null
        })
    }

    useEffect(() => {
        socket.on("endCallToClient", data => {
            if (tracks) {
                tracks.forEach(track => track.stop());
            }
            addCallMessage(data, data.times);
            if (newCall) newCall.close();
            dispatch({
                type: GlobalyTypes.CALL,
                isEndpointCalled: false,
                data: null
            })
        })
        return () => socket.off("endCallToClient");
    }, [dispatch, socket, tracks, addCallMessage, newCall]);

    //Stream Media
    const openStream = (video) => {
        const config = { audio: true, video };
        return navigator.mediaDevices.getUserMedia(config);
    }

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        video.play();
    }

    //Answer Call
    const AnswerHandler = () => {
        openStream(call.video).then(stream => {
            playStream(yourVideo.current, stream)
            const tracks = stream.getTracks();
            setTracks(tracks);

            var newCall = peer.call(call.peerId, stream);
            newCall.on("stream", function (remoteStream) {
                playStream(otherVideo, remoteStream);
            })
            setAnswer(true);
            setNewCall(newCall);
        })
    }

    useEffect(() => {
        peer.on("call", newCall => {
            openStream(call.video).then(stream => {
                if (yourVideo.current) {
                    playStream(yourVideo.current, stream);
                }

                const tracks = stream.getTracks();
                setTracks(tracks);

                newCall.answer = stream;
                newCall.on("stream", function (remoteStream) {
                    if (otherVideo.current) {
                        playStream(otherVideo, remoteStream);
                    }
                })

                setAnswer(true);
                setNewCall(newCall);
            })
        })
        return () => peer.removeListener("call");
    }, [peer, call.video])

    // Disconnect
    useEffect(() => {
        socket.on("callerDisconnect", () => {
            if (tracks) {
                tracks.forEach(track => track.stop());
            }

            let times = answer ? total : 0;
            addCallMessage(call, times, true)
            if (newCall) newCall.close();

            dispatch({
                type: GlobalyTypes.CALL,
                isEndpointCalled: false,
                data: null
            })
            dispatch({
                type: GlobalyTypes.ALERT,
                isEndpointCalled: false,
                msg: `The ${call.username} disconnect`
            })
        })
        return () => socket.off("callerDisconnect")
    }, [dispatch, tracks, socket, call, answer, total, addCallMessage, newCall])

    const playAudio = (newAudio) => {
        newAudio.play();
    }

    const pauseAudio = (newAudio) => {
        newAudio.pause();
        newAudio.currentTime = 0;
    }

    useEffect(() => {
        let audio = new Audio(callRing);
        if (answer) {
            pauseAudio(audio)
        }
        else {
            playAudio(audio);
        }

        return () => pauseAudio(audio);
    }, [answer])

    return (
        <div className="call_modal">
            <div className="call_box" style={{ display: (answer && call.video) ? "none" : "flex" }}>
                <div>
                    <Avatar src={call.avatar} size="supper-avatar" />
                    <h4>{call.username}</h4>
                    <h4>{call.fullname}</h4>

                    <div>
                        {
                            answer
                                ? <div>
                                    <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
                                    <span>:</span>
                                    <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
                                    <span>:</span>
                                    <span>{second.toString().length < 2 ? "0" + second : second}</span>
                                </div>
                                : call.video
                                    ? <span>"calling video..."</span>
                                    : <span>"calling audio..."</span>
                        }
                    </div>
                </div>
                {
                    !answer &&
                    <div className="timer">
                        <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
                        <small>:</small>
                        <small>{second.toString().length < 2 ? "0" + second : second}</small>
                    </div>
                }
                <div className="call_menu">
                    <span className="material-icons text-danger"
                        onClick={endCallHandler}>
                        call_end
                    </span>
                    {
                        (call.recipient === userLogin.userInfo._id && !answer) &&
                        <>
                            {
                                call.video
                                    ? <span className="material-icons text-success"
                                        onClick={AnswerHandler}>
                                        videocam
                            </span>
                                    : <span className="material-icons text-success"
                                        onClick={AnswerHandler}>
                                        call
                            </span>
                            }
                        </>
                    }
                </div>
            </div>
            <div className="show_video"
                style={{
                    opacity: (answer && call.video) ? "1" : "0",
                    filter: theme ? "invert(1)" : "invert(0)"
                }}>
                <video className="your_video" ref={yourVideo} />
                <video className="other_video" ref={otherVideo} />

                <div className="time_video">
                    <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
                    <span>:</span>
                    <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
                    <span>:</span>
                    <span>{second.toString().length < 2 ? "0" + second : second}</span>
                </div>

                <span className="material-icons text-danger call_end"
                    onClick={endCallHandler}>
                    call_end
                    </span>
            </div>
        </div>
    )
}
