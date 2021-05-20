import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Search from './Search';

export default function Header() {


    return (
        <header className="bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="logo" to="/">
                        <h1 onClick={() => window.scrollTo({ top: 0 })} className="navbar-brand p-0 m-0">MHGRAM</h1>
                    </Link>

                    <Search />

                    <Menu />
                </div>
            </nav>
        </header>
    )
}
