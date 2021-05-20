import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../Redux/actions/userAction';
import Avatar from '../Avatar';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';
import NotifyModal from './NotifyModal';

export default function Menu() {

    const navLink = [
        { lable: "Home", icon: "home", path: "/" },
        { lable: "Message", icon: "near_me", path: "/message" },
        { lable: "Discover", icon: "explore", path: "/discover" },
    ]

    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const { theme } = useSelector(state => state);

    const notify = useSelector(state => state.notify);
    const { notifies } = notify;

    const themeHandler = () => {
        dispatch({ type: GlobalyTypes.THEME, isEndpointCalled: false, theme: !theme });
    }

    const logoutHandler = () => {
        dispatch(userLogout());
    }

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row mb-2 mb-lg-0">
                {
                    navLink.map((item, index) => {
                        return <li key={index} className={`nav-item px-2 ${pathname === item.path ? "active" : ""}`}>
                            <Link className="nav-link" aria-current="page"
                                to={item.path}>
                                <span className="material-icons">{item.icon}</span>
                            </Link>
                        </li>
                    })
                }

                <li className="nav-item dropdown" style={{ opacity: 1 }}>
                    <span className="nav-link position-relative" href="#" id="navbarDropdown"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="material-icons" style={{ color: notifies.length > 0 ? "crimson" : "" }}>
                            favorite
                        </span>
                        <span className="notify-length">{notifies.length}</span>
                    </span>
                    <div className="dropdown-menu" aria-labelledby="narDavbropdown"
                    style={{transform:"translateX(75px)"}}>
                        <NotifyModal />
                    </div>
                </li>

                <li className="nav-item dropdown" style={{ opacity: 1 }}>
                    <span className="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Avatar src={userInfo.avatar} size="big-avatar" />
                    </span>
                    <ul className="dropdown-menu" aria-labelledby="narDavbropdown">
                        <li><Link className="dropdown-item" to={`/profile/${userInfo._id}`}>Profile</Link></li>
                        <li>
                            <label onClick={themeHandler} htmlFor="theme" className="dropdown-item">
                                {theme ? "Light mode" : "Dark mode"}
                            </label>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link onClick={logoutHandler} className="dropdown-item" to="/">Logout</Link></li>
                    </ul>
                </li>
            </ul>
        </div >
    )
}
