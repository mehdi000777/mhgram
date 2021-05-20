import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Redux/actions/userAction';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LogIn() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pass, setPass] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const UserLogin = useSelector(state => state.userLogin);
    const { token } = UserLogin;

    useEffect(() => {
        if (token) history.push("/");
    }, [token, history])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(userLogin({ email, password }));
    }

    return (
        <div className="auth_page">
            <form onSubmit={submitHandler}>
                <h3 className="text-center mb-3">MHGRAM</h3>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1"
                        aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <div className="pass">
                        <input type={pass ? "text" : "password"} className="form-control" id="exampleInputPassword1"
                            onChange={(e) => setPassword(e.target.value)} value={password} />
                        <small onClick={() => setPass(!pass)}>
                            {pass ? "Show" : "Hide"}
                        </small>
                    </div>
                </div>
                <button type="submit" className="btn btn-dark w-100"
                    disabled={email && password ? false : true}>
                    Login
                </button>
                <p className="mt-2">
                    You don't have an account <Link style={{ color: "crimson" }} to="/register">Register Now</Link>
                </p>
            </form>
        </div>
    )
}
