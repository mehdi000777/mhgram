import express from 'express';
import { Auth } from '../Middelware/Auth.js';
import Comment from '../Models/commentModel.js';
import Post from '../Models/PostModel.js';


const commentRouter = express.Router();

commentRouter.post("/comment", Auth, async (req, res) => {
    try {
        const { postId, content, tag, reply, postUserId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(400).send({ message: "This post does not exist." });

        if (reply) {
            const comment = Comment.findById(reply);
            if (!comment) return res.status(400).send({ message: "This comment does not exist." });
        }

        const newComment = new Comment({
            content, tag, reply, user: req.user._id, postUserId, postId
        });

        await Post.findOneAndUpdate({ _id: postId }, {
            $push: { comments: newComment }
        }, { new: true })

        await newComment.save();

        res.send({
            newComment
        })

    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})

commentRouter.patch("/comment/:id", Auth, async (req, res) => {
    try {
        const { content } = req.body;

        const cm = await Comment.findOneAndUpdate({ _id: req.params.id, user: req.user._id },
            { content }
        );
        if (!cm) return res.status(400).send({ message: "Wrong!" });

        res.send({
            message: "Update Success!"
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})

commentRouter.patch("/comment/:id/like", Auth, async (req, res) => {
    try {
        const comment = await Comment.find({ _id: req.params.id, likes: req.user._id });
        if (comment.length > 0) return res.status(400).send({ message: "You liked this post." });

        await Comment.findOneAndUpdate({ _id: req.params.id }, {
            $push: { likes: req.user._id }
        }, { new: true });

        res.send({
            message: "Liked Comment!"
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})

commentRouter.patch("/comment/:id/unlike", Auth, async (req, res) => {
    try {
        await Comment.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { likes: req.user._id }
        }, { new: true });

        res.send({
            message: "Unliked Comment!"
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})

commentRouter.delete("/comment/:id", Auth, async (req, res) => {
    try {

        const comment = await Comment.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { user: req.user._id },
                { postUserId: req.user._id }
            ]
        });

        await Post.findOneAndUpdate({ _id: comment.postId }, {
            $pull: { comments: req.params.id }
        }, { new: true });

        res.send({
            message: "Delete Comment!"
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})

export default commentRouter;