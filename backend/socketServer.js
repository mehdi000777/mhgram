let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => item.id === id
        ? { ...item, call }
        : item
    )
    return newData;
}

const SocketServer = (socket) => {
    // Connect && Disconnect
    socket.on("joinUser", user => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers });
    })

    socket.on("disconnect", () => {
        const data = users.find(user => user.socketId === socket.id);
        if (data) {
            const clients = users.filter(user => data.followers.find(item => item._id === user.id));

            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit("checkUserOffline", data.id);
                })
            }

            if (data.call) {
                const callUser = users.find(user => user.id === data.call);
                if (callUser) {
                    users = EditData(users, callUser.id, null);
                    socket.to(`${callUser.socketId}`).emit("callerDisconnect");
                }
            }
        }

        users = users.filter(user => user.socketId !== socket.id)
    })

    // Likes
    socket.on("likePost", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("likeToClient", newPost);
            })
        }
    })

    socket.on("unLikePost", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
            })
        }
    })

    // comments
    socket.on("createComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
            })
        }
    })

    socket.on("updateComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("updateCommentToClient", newPost);
            })
        }
    })

    socket.on("likeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("likeCommentToClient", newPost);
            })
        }
    })

    socket.on("unlikeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("unlikeCommentToClient", newPost);
            })
        }
    })

    socket.on("removeComment", newPost => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter(user => ids.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("removeCommentToClient", newPost);
            })
        }
    })

    //follow
    socket.on("follow", newUser => {
        const user = users.find(user => user.id === newUser._id);
        user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
    })

    socket.on("unFollow", newUser => {
        const user = users.find(user => user.id === newUser._id);
        user && socket.to(`${user.socketId}`).emit("unFollowToClient", newUser);
    })

    //Notify
    socket.on("createNotify", msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
            })
        }
    })

    socket.on("removeNotify", msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id));

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
            })
        }
    })

    //Message

    socket.on("addMessage", ({ msg, userSender }) => {
        const client = users.find(user => user.id === msg.recipient);

        if (client) {
            socket.to(`${client.socketId}`).emit("addMessageClient", { msg, userSender });
        }
    })

    // Online or Offline User

    socket.on("checkUserOnline", data => {
        const following = users.filter(user => data.following.find(item => item._id === user.id));
        socket.emit("checkUserOnlineToMe", following);

        const clients = users.filter(user => data.followers.find(item => item._id === user.id));
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit("checkUserOnlineToClient", data._id);
            })
        }
    })

    // Call

    socket.on("callUser", data => {
        users = EditData(users, data.sender, data.recipient);

        const client = users.find(user => user.id === data.recipient);
        if (client) {
            if (client.call) {
                users = EditData(users, data.sender, null);
                socket.emit("userBusy", null);
            }
            else {
                users = EditData(users, data.recipient, data.sender);
                socket.to(`${client.socketId}`).emit("callUserToClient", data);
            }
        }
    })

    socket.on("endCall", data => {
        console.log(data);
        const client = users.find(user => user.id === data.sender);

        if (client) {
            socket.to(`${client.socketId}`).emit("endCallToClient", data);
            users = EditData(users, client.id, null);

            if (client.call) {
                const clientCall = users.find(user => user.id === client.call);
                clientCall && socket.to(`${clientCall.socketId}`).emit("endCallToClient", data);
                users = EditData(users, client.call, null);
            }
        }
    })

}

export default SocketServer;