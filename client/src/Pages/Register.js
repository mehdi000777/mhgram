import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { registerUser } from '../Redux/actions/userAction';

export default function Register() {

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cf_password, setCf_Password] = useState("");
    const [gender, setGender] = useState("male");

    const [pass, setPass] = useState(false);
    const [cf_pass, setCf_Pass] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { token, valid } = userLogin;

    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) history.push("/");
    }, [token, history])


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(registerUser({ fullname, username, email, password, cf_password, gender }));
    }

    return (
        <div className="auth_page">
            <form onSubmit={submitHandler}>
                <h3 className="text-center mb-3">MHGRAM</h3>
                <div className="mb-3">
                    <label htmlFor="fullname" className="form-label" >Full Name</label>
                    <input type="text" className="form-control" id="fullname"
                        onChange={(e) => setFullname(e.target.value)} value={fullname}
                        style={valid && { background: valid.errMessage.fullname ? "#fd2d6a14" : "" }} />
                    {valid &&
                        <div className="form-text text-danger">{valid.errMessage.fullname}</div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label" >User Name</label>
                    <input type="text" className="form-control" id="username"
                        onChange={(e) => setUsername(e.target.value)} value={username.toLowerCase().replace(/ /g, "")}
                        style={valid && { background: valid.errMessage.username ? "#fd2d6a14" : "" }} />
                    {valid &&
                        <div className="form-text text-danger">{valid.errMessage.username}</div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1"
                        aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email}
                        style={valid && { background: valid.errMessage.email ? "#fd2d6a14" : "" }} />
                    {valid &&
                        <div className="form-text text-danger">{valid.errMessage.email}</div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <div className="pass">
                        <input type={pass ? "text" : "password"} className="form-control" id="exampleInputPassword1"
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            style={valid && { background: valid.errMessage.password ? "#fd2d6a14" : "" }} />
                        <small onClick={() => setPass(!pass)}>
                            {pass ? "Show" : "Hide"}
                        </small>
                    </div>
                    {valid &&
                        <div className="form-text text-danger">{valid.errMessage.password}</div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
                    <div className="pass">
                        <input type={cf_pass ? "text" : "password"} className="form-control" id="exampleInputPassword1"
                            onChange={(e) => setCf_Password(e.target.value)} value={cf_password}
                            style={valid && { background: valid.errMessage.cf_password ? "#fd2d6a14" : "" }} />
                        <small onClick={() => setCf_Pass(!cf_pass)}>
                            {cf_pass ? "Show" : "Hide"}
                        </small>
                    </div>
                    {valid &&
                        <div className="form-text text-danger">{valid.errMessage.cf_password}</div>
                    }
                </div>
                <div className="gender mx-0 mb-2">
                    <label htmlFor="male">
                        Male: <input type="radio" name="gender" id="male" value="male" defaultChecked
                            onChange={(e) => setGender(e.target.value)} />
                    </label>

                    <label htmlFor="female">
                        Female: <input type="radio" name="gender" id="female" value="female"
                            onChange={(e) => setGender(e.target.value)} />
                    </label>
                </div>
                <button type="submit" className="btn btn-dark w-100">
                    Register
                </button>
                <p className="mt-2">
                    You already have an account <Link style={{ color: "crimson" }} to="/login">login Now</Link>
                </p>
            </form>
        </div >
    )
}
