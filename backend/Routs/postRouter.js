import express from 'express';
import { Auth } from '../Middelware/Auth.js';
import Post from '../Models/PostModel.js';
import Comment from '../Models/commentModel.js';
import { APIfeatures } from '../utils.js';
import User from '../Models/userModel.js';


const postRouter = express.Router();

postRouter.post("/posts", Auth, async (req, res) => {
    try {
        const { images, content } = req.body;

        if (images.length === 0)
            return res.status(400).send({ message: "Please add your photo." });

        const newPost = new Post({
            images,
            content,
            user: req.user._id
        });
        await newPost.save();

        res.send({
            message: "Create post!",
            newPost: {
                ...newPost._doc,
                user: req.user
            }
        })

    } catch (error) {
        res.status(500).send({ message: error });
    }
});

postRouter.get("/posts", Auth, async (req, res) => {
    try {
        const features = new APIfeatures(Post.find({ user: [...req.user.following, req.user._id] }),
            req.query).paginating();

        const posts = await features.query.sort("-createdAt")
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        res.send({
            message: "Success!",
            result: posts.length,
            posts
        })
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.patch("/post/:id", Auth, async (req, res) => {
    try {
        const { content, images } = req.body;
        const post = await Post.findOneAndUpdate({ _id: req.params.id }, {
            content, images
        }).populate("user likes", "avatar username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        res.send({
            message: "Updated Post!",
            newPost: {
                ...post._doc,
                content,
                images
            }
        })
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.patch("/post/:id/like", Auth, async (req, res) => {
    try {
        const post = await Post.find({ _id: req.params.id, likes: req.user._id });
        if (post.length > 0) return res.status(400).send({ message: "You liked this post." });

        const like = await Post.findOneAndUpdate({ _id: req.params.id }, {
            $push: { likes: req.user._id }
        }, { new: true });

        if (!like) return res.status(400).send({ message: "This post does not exist." });

        res.send({ message: "Liked Post!" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.patch("/post/:id/unlike", Auth, async (req, res) => {
    try {
        const like = await Post.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { likes: req.user._id }
        }, { new: true });

        if (!like) return res.status(400).send({ message: "This post does not exist." });

        res.send({ message: "UnLiked Post!" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.get("/user_posts/:id", Auth, async (req, res) => {
    try {
        const features = new APIfeatures(Post.find({ user: req.params.id }),
            req.query).paginating();

        const posts = await features.query.sort("-createdAt");

        res.send({
            posts,
            result: posts.length
        })

    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.get("/post/:id", Auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user likes", "fullname username avatar followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        if (!post) return res.status(400).send({ message: "This post does not exist." });

        res.send({ post });

    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.get("/post_discover", Auth, async (req, res) => {
    try {
        const newArr = [...req.user.following, req.user._id];

        const num = req.query.num || 9;

        const posts = await Post.aggregate([
            { $match: { user: { $nin: newArr } } },
            { $sample: { size: Number(num) } }
        ])

        res.send({
            message: "Success!",
            result: posts.length,
            posts
        })

    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.delete("/post/:id", Auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        await Comment.deleteMany({ _id: { $in: post.comments } });

        res.send({
            message: "Deleted Post!",
            newPost: {
                ...post,
                user: req.user
            }
        });

    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.patch("/savePost/:id", Auth, async (req, res) => {
    try {
        const user = await User.find({ _id: req.user._id, saved: req.params.id });
        if (user.length > 0) return res.status(400).send({ message: "You saved this post." });

        const saved = await User.findOneAndUpdate({ _id: req.user._id }, {
            $push: { saved: req.params.id }
        }, { new: true });

        if (!saved) return res.status(400).send({ message: "This user does not exist." });

        res.send({ message: "Saved Post!" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.patch("/unSavePost/:id", Auth, async (req, res) => {
    try {
        const saved = await User.findOneAndUpdate({ _id: req.user._id }, {
            $pull: { saved: req.params.id }
        }, { new: true });

        if (!saved) return res.status(400).send({ message: "This user does not exist." });

        res.send({ message: "unSaved Post!" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
})

postRouter.get("/getSavePosts", Auth, async (req, res) => {
    try {
        const features = new APIfeatures(Post.find({ _id: { $in: req.user.saved } }),
            req.query).paginating();

        const savePosts = await features.query.sort("-createdAt");

        res.send({
            savePosts,
            result: savePosts.length
        });

    } catch (error) {
        res.status(500).send({ message: error });
    }
})

export default postRouter;