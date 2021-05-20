import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPost, editPosts } from '../../Redux/actions/postAction';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import Icons from '../Icons';
import { imageShowe, videoShowe } from '../../Utils/mediaShow';

export default function StatusModal() {

    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [stream, setStream] = useState(false);
    const [tracks, setTracks] = useState();

    const videoRef = useRef();
    const canvasRef = useRef();

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, token } = userLogin;

    const { theme, status, socket } = useSelector(state => state);

    const dispatch = useDispatch();

    const closeHandler = () => {
        dispatch({ type: GlobalyTypes.STATUS, isEndpointCalled: false, payLoad: false });
    }

    const imageHandler = (e) => {
        const files = [...e.target.files];
        let err = "";
        let imageArr = [];

        files.forEach(item => {
            if (!item) return err = "File does not exist.";

            if (item.size > 1024 * 1024 * 5) {
                return err = "The file largest is 5mb";
            }
            else {
                return imageArr.push(item);
            }
        });

        if (err) return dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: err });
        setImages([...images, ...imageArr]);
    }

    const deleteimage = (index) => {
        const newimages = [...images];
        newimages.splice(index, 1);
        setImages(newimages);
    }

    const streamHandler = () => {
        setStream(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                    const track = mediaStream.getTracks();
                    setTracks(track[0]);
                }).catch(err =>
                    console.log(err)
                );
        }
    }

    const captureHandler = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        canvasRef.current.setAttribute("width", width);
        canvasRef.current.setAttribute("height", height);

        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        let URL = canvasRef.current.toDataURL();
        setImages([...images, { camera: URL }]);
    }

    const closeStreamHandler = () => {
        if (tracks) tracks.stop();
        setStream(false);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (images.length <= 0)
            return dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: "Please add your photo." });

        if (status.onEdit) {
            dispatch(editPosts({ images, content, token, status }));
        }
        else {
            dispatch(createPost({ images, content, token, userInfo, socket }));
        }

        setContent("");
        setImages([]);
        if (tracks) tracks.stop();
        dispatch({ type: GlobalyTypes.STATUS, isEndpointCalled: false, payLoad: false })
    }

    useEffect(() => {
        if (status.onEdit) {
            setContent(status.content);
            setImages(status.images);
        }
    }, [status])

    return (
        <div className="status-modal">
            <form onSubmit={submitHandler}>
                <div className="status-header">
                    <h5 className="m-0">Create Post</h5>
                    <span onClick={closeHandler}>&times;</span>
                </div>
                <div className="status-body">
                    <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)}
                        placeholder={`${userInfo.username}, whate are you thinking?`}
                        style={{
                            filter: theme ? "invert(1)" : "invert(0)",
                            background: theme ? "rgba(0,0,0,.03)" : "",
                            color: theme ? "#fff" : "#111",
                        }} />

                    <div className="show-images">
                        {
                            images.map((img, index) => {
                                return <div key={index} id="file-img">
                                    {
                                        img.camera ? imageShowe(img.camera)
                                            : img.url
                                                ? <>
                                                    {
                                                        img.url.match(/video/i)
                                                            ? videoShowe(img.url, theme)
                                                            : imageShowe(img.url, theme)
                                                    }
                                                </>
                                                : <>
                                                    {
                                                        img.type.match(/video/i)
                                                            ? videoShowe(URL.createObjectURL(img), theme)
                                                            : imageShowe(URL.createObjectURL(img), theme)
                                                    }
                                                </>
                                    }
                                    <span onClick={() => deleteimage(index)}>&times;</span>
                                </div>
                            })
                        }
                    </div>
                    {
                        stream &&
                        <div className="stream">
                            <video ref={videoRef} autoPlay muted width="100%" height="100%"
                                style={{ filter: theme ? "invert(1)" : "invert(0)" }} />
                            <span onClick={closeStreamHandler}>&times;</span>
                            <canvas ref={canvasRef} style={{ display: "none" }} />
                        </div>
                    }
                    <div className="d-flex">
                        <div className="flex-fill"></div>
                        <Icons setContent={setContent} content={content} />
                    </div>
                </div>
                <div className="input-image">
                    {
                        stream ? <i onClick={captureHandler} className="fas fa-camera"></i>
                            : <>
                                <i onClick={streamHandler} className="fas fa-camera"></i>
                                <div className="file-upload">
                                    <i className="fas fa-image"></i>
                                    <input type="file" name="file" id="file" multiple accept="image/*,video/*"
                                        onChange={imageHandler} />
                                </div>
                            </>
                    }

                </div>
                <div className="status-footer">
                    <button className="btn btn-secondary w-100" type="submit">
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}
