import { Route, BrowserRouter, Switch } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Register from './Pages/Register';
import NotFound from './Pages/NotFound';
import Home from './Pages/Home';
import Alert from './Component/notify/Notify';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { refresh_token, suggestionsUser } from './Redux/actions/userAction';
import Header from './Component/header/Header';
import Message from './Pages/message/index';
import Discover from './Pages/Discover';
import Profile from './Pages/Profile';
import PrivateRouter from './Component/privateRout/PrivateRouter';
import StatusModal from './Component/home/StatusModal';
import { getPosts } from './Redux/actions/postAction';
import Post from './Pages/Post';
import io from 'socket.io-client';
import { GlobalyTypes } from './Redux/actionTypes/globalTypes';
import SocketClient from './SocketClient';
import { getNotifies } from './Redux/actions/notifyAction';
import Conversation from './Pages/message/Conversation';
import CallModal from './Component/message/CallModal';
import Peer from 'peerjs';

function App() {

  const userLogin = useSelector(state => state.userLogin);
  const { token } = userLogin;

  const { status, modal, call } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refresh_token());
    const socket = io();
    dispatch({ type: GlobalyTypes.SOCKET, isEndpointCalled: false, payload: socket });
    return () => socket.close();
  }, [dispatch])

  useEffect(() => {
    if (token) {
      dispatch(getPosts(token));
      dispatch(suggestionsUser(token));
      dispatch(getNotifies(token));
    }
  }, [dispatch, token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") { }

    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: "/", secure: true
    })
    dispatch({
      type: GlobalyTypes.PEER,
      isEndpointCalled: false,
      payload: newPeer
    })
  }, [dispatch])

  return (
    <BrowserRouter>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && "mode"}`}>
        <div className="main">
          {token && <Header />}
          {status && <StatusModal />}
          {token && <SocketClient />}
          {call && <CallModal />}
          <Switch>
            <Route exact path="/" component={token ? Home : LogIn} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={LogIn} />
            <PrivateRouter exact path="/message" component={token ? Message : NotFound} />
            <PrivateRouter exact path="/message/:id" component={token ? Conversation : NotFound} />
            <PrivateRouter exact path="/discover" component={token ? Discover : NotFound} />
            <PrivateRouter exact path="/profile/:id" component={token ? Profile : NotFound} />
            <PrivateRouter exact path="/post/:id" component={token ? Post : NotFound} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
