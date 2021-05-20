import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import apiMiddleware from './middelware';
import { loginReducer } from '../reducer/userReducer/loginReducer';
import { ProfileReducer } from '../reducer/userReducer/profileReducer';
import { UpdateProfileReducer } from '../reducer/userReducer/updateReducer';
import { AlertReducer } from '../reducer/AlertReducer';
import { ThemeReducer } from '../reducer/themeReducer';
import { FollowReducer } from '../reducer/userReducer/followReducer';
import { StatusReducer } from '../reducer/statusReducer';
import { PostReducer } from '../reducer/postReducer/postReducer';
import { ModalReducer } from '../reducer/modalReducer';
import { PostDtailsReducer } from '../reducer/postReducer/postDtails';
import { DiscoverPostsReducer } from '../reducer/postReducer/discoverPostsReducer';
import { SuggestionUserReducer } from '../reducer/userReducer/suggestionUserReducer';
import { SocketReducer } from '../reducer/socketReducer';
import { notifiesReducer } from '../reducer/notifyReducer/notifiesReducer';
import { messageReducer } from '../reducer/messageReducer/messageReducer';
import { OnlineReducer } from '../reducer/onlineReducer';
import { callReducer } from '../reducer/messageReducer/callReducer';
import { PeerReducer } from '../reducer/peerReducer';


const store = createStore(combineReducers({
    userLogin: loginReducer,
    profile: ProfileReducer,
    updateProfile: UpdateProfileReducer,
    alert: AlertReducer,
    theme: ThemeReducer,
    follow: FollowReducer,
    status: StatusReducer,
    homePosts: PostReducer,
    modal: ModalReducer,
    post: PostDtailsReducer,
    discover: DiscoverPostsReducer,
    suggestion: SuggestionUserReducer,
    socket: SocketReducer,
    notify: notifiesReducer,
    message: messageReducer,
    online: OnlineReducer,
    call: callReducer,
    peer: PeerReducer
}),
    composeWithDevTools(applyMiddleware(apiMiddleware, thunk))
);

export default store;