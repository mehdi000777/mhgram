import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../Redux/actions/userAction';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import { checkImage } from '../../Utils/imageUpload';

export default function EditProfile({ user, setEditProfile }) {

    const initState = {
        fullname: "", mobile: "", address: "", website: "", story: "", gender: "male"
    };

    const [data, setData] = useState(initState);
    const [avatar, setAvatar] = useState("");

    const { fullname, mobile, address, website, story, gender } = data

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, token } = userLogin;

    const theme = useSelector(state => state.theme);

    const dispatch = useDispatch();

    const handelInput = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value });
    }

    const handelUpload = (e) => {
        const file = e.target.files[0];
        const err = checkImage(file);
        if (err) {
            dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: err });
        }
        setAvatar(file);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile({ data, avatar, userInfo, token, userLogin }));
    }

    useEffect(() => {
        setData(user)
    }, [user])

    return (
        <div className="edit-profile">
            <button className="btn btn-danger btn_close" onClick={() => setEditProfile(false)}>
                Close
            </button>

            <form onSubmit={submitHandler}>
                <div className="info-avatar">
                    <img src={avatar ? URL.createObjectURL(avatar) : userInfo.avatar} alt="avatar"
                        style={{ filter: theme ? "invert(1)" : "invert(0)" }} />
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" id="file_up" accept="image/*" onChange={handelUpload} />
                    </span>
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <div className="position-relative">
                        <input type="text" className="form-control" name="fullname" id="fullname" value={fullname}
                            onChange={handelInput} />
                        <small className="text-danger position-absolute"
                            style={{ top: "50%", right: "5px", transform: "translateY(-50%)" }}>
                            {fullname.length}/25
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="text" name="mobile" id="mobile" className="form-control" value={mobile}
                        onChange={handelInput} />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address" className="form-control" value={address}
                        onChange={handelInput} />
                </div>
                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input type="text" name="website" id="website" className="form-control" value={website}
                        onChange={handelInput} />
                </div>
                <div className="form-group">
                    <label htmlFor="story">Story</label>
                    <textarea name="story" cols="30" rows="4" id="story" className="form-control" value={story}
                        onChange={handelInput} />
                    <small className="text-danger d-block text-end">
                        {story.length}/200
                    </small>
                </div>
                <label htmlFor="gender">Gender</label>
                <div className="px-0 mb-4">
                    <select className="form-select text-capitalize" name="gender" id="gender" value={gender} onChange={handelInput}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-info w-100">Save</button>
            </form>
        </div>
    )
}
