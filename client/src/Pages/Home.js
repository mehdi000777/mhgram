import React, { useEffect } from 'react';
import Post from '../Component/home/Posts';
import Status from '../Component/home/Status';
import { useSelector } from 'react-redux';
import loadingIcon from '../images/Spinner-1s-204px.gif'
import RightSideBar from '../Component/home/RightSideBar';

let scroll = 0;

export default function Home() {

    const homePosts = useSelector(state => state.homePosts);
    const { loading, result } = homePosts;

    window.addEventListener("scroll", () => {
        if (window.location.pathname === "/") {
            scroll = window.pageYOffset;
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: scroll, behavior: "smooth" });
        }, 200);
    }, [])

    return (
        <div className="home row mx-0">
            <div className="col-md-8">
                <Status />
                {
                    loading ? <img src={loadingIcon} alt="loading" className="d-block mx-auto" />
                        : result === 0 ? <h2 className="text-center">No Post</h2> : <Post />
                }
            </div>
            <div className="col-md-4">
                <RightSideBar />
            </div>
        </div>
    )
}
