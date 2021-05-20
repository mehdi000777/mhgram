import React, { useEffect, useState } from 'react'
import LoadMoreBtn from '../LoadMoreBtn';
import PostThumb from './PostThumb';
import loadIcon from '../../images/Spinner-1s-204px.gif';
import axios from 'axios';
import { GlobalyTypes } from '../../Redux/actionTypes/globalTypes';

export default function Saved({ dispatch, userLogin }) {

    const [savePosts, setSavePosts] = useState([]);
    const [result, setResult] = useState(9);
    const [page, setPage] = useState(2);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
        const get = async () => {
            await axios("/api/getSavePosts", {
                method: "get",
                headers: {
                    Authorization: userLogin.token
                }
            }).then(res => {
                setSavePosts(res.data.savePosts);
                setResult(res.data.result);
                setLoad(false)
            }).catch(error => {
                dispatch({ type: GlobalyTypes.ALERT, isEndpointCalled: false, msg: error.response.data.message })
            })
        }
        get();
        return () => setSavePosts([]);
    }, [dispatch, userLogin.token])

    const loadMoreHandler = async () => {
        setLoad(true);

        const res = await axios(`/api/getSavePosts?limit=${page * 9}`, {
            method: "get",
            headers: {
                Authorization: userLogin.token
            }
        });
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
        setPage(page + 1);

        setLoad(false);
    }

    return (
        <div>
            <PostThumb posts={savePosts} result={result} />

            {
                load && <img src={loadIcon} alt="loading" className="d-block mx-auto" />
            }

            <LoadMoreBtn result={result} load={load} loadMoreHandler={loadMoreHandler} page={page} />
        </div>
    )
}
