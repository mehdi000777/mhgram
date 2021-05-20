import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserCard from '../UserCard';
import axios from 'axios';
import loadIcon from '../../images/Spinner-1s-204px.gif'

export default function Search() {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(false);

    const userLogin = useSelector(state => state.userLogin)
    const { token } = userLogin;

    const closeSearchHandler = () => {
        setUsers([]);
        setSearch("")
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!search) return;

        try {
            setLoad(true);
            const response = await axios(`/api/search?username=${search}`, { method: "get", headers: { Authorization: token } });
            setUsers(response.data.users);
            setLoad(false);
        }
        catch (error) {
            console.log(error.response.message);
        }
    }

    return (
        <div className="search">
            <form className="search-form" onSubmit={submitHandler}>
                <input type="text" id="search" value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/ /g, ""))} />

                <div className="search-icon" style={{ opacity: search ? "0" : ".3" }}>
                    <span className="material-icons">search</span>
                    <span>Search</span>
                </div>
                <div className="close-search" style={{ opacity: users.length === 0 ? "0" : "1" }} onClick={closeSearchHandler}>
                    &times;
                </div>
                <button type="submit" style={{ display: "none" }}>search</button>

                {load && <img src={loadIcon} className="load" alt="loading" />}

                <div className="users">
                    {search && users.map(user => {
                        return <UserCard key={user._id} user={user} closeSearchHandler={closeSearchHandler} border="border" />
                    })}
                </div>
            </form>
        </div>
    )
}
