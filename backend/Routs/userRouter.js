import express from 'express';
import bcrypt from 'bcrypt';
import User from '../Models/userModel.js';
import { generateRefreshToken, generateToken } from '../utils.js';
import jwt from 'jsonwebtoken';
import { Auth } from '../Middelware/Auth.js';


const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
    try {
        const { fullname, username, email, password, gender } = req.body;
        const newUserName = username.toLowerCase().replace(/ /g, '')

        const user_name = await User.findOne({ username: newUserName });
        if (user_name) return res.status(400).send({ message: "This user name already exists." });

        const user_email = await User.findOne({ email });
        if (user_email) return res.status(400).send({ message: "This email already exists." });

        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters." });
        }

        const password_Hash = bcrypt.hashSync(password, 12);

        const newUser = new User({
            fullname,
            username: newUserName,
            email,
            password: password_Hash,
            gender
        });

        const access_token = generateToken(newUser);
        const refresh_token = generateRefreshToken(newUser);

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/refresh_token",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        await newUser.save();

        res.send({
            message: "register success!",
            access_token,
            user: {
                ...newUser._doc,
                password: ""
            }
        });
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate("followers following", "-password");

        if (!user) res.status(400).send({ message: "This email does not exists." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) res.status(400).send({ message: "Password is incorrect." });


        const access_token = generateToken(user);
        const refresh_token = generateRefreshToken(user);

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/refresh_token",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.send({
            message: "login success!",
            access_token,
            user: {
                ...user._doc,
                password: ""
            }
        });
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
});

userRouter.post("/logout", async (req, res) => {
    try {
        res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
        res.send({ message: "logout success" });
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
});

userRouter.post("/refresh_token", async (req, res) => {
    try {
        const ref_token = req.cookies.refreshtoken;
        if (!ref_token) res.status(400).send({ message: "Please login now." });

        jwt.verify(ref_token, process.env.JWT_SECRET_REFRESH || 'somethingsecretrefresh', async (err, result) => {
            if (err) return res.status(400).send({ message: "Please login now." })

            const user = await User.findById(result._id).select("-password").populate("followers following", "-password");
            if (!user) return res.status(400).send({ message: "This does not exist" });

            const access_token = generateToken(result);

            res.send({
                access_token,
                user
            });
        });
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.get("/search", Auth, async (req, res) => {
    try {
        const search = req.query.username
        const users = await User.find({ username: { $regex: search } }).limit(10).select("fullname username avatar");
        console.log(users);
        res.send({ users });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.get("/user/:id", Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password").
            populate("followers following", "-password");
        if (!user) return res.status(404).send({ message: "User Not Found" });
        res.send({ user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.patch("/user", Auth, async (req, res) => {
    try {
        const { avatar, fullname, address, website, mobile, gender, story } = req.body;

        if (!fullname) return res.status(400).send({ message: "Please enter your full name" });

        const user = await User.findOneAndUpdate({ _id: req.user._id }, {
            avatar, fullname, address, website, mobile, gender, story
        });

        res.send({
            message: "Upadate Success!", user: {
                ...user._doc,
                password: ""
            }
        })

    } catch (error) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.patch("/user/:id/follow", Auth, async (req, res) => {
    try {
        const user = await User.find({ _id: req.params.id, followers: req.user._id });
        if (user.length > 0) return res.status(400).send({ message: "You followed this user." });

        const newUser = await User.findOneAndUpdate({ _id: req.params.id }, {
            $push: { followers: req.user._id }
        }, { new: true }).populate("followers following", "-password");

        await User.findOneAndUpdate({ _id: req.user._id }, {
            $push: { following: req.params.id }
        }, { new: true });

        res.send({ newUser })

    } catch (error) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.patch("/user/:id/unfollow", Auth, async (req, res) => {
    try {
        const newUser = await User.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { followers: req.user._id }
        }, { new: true }).populate("followers following", "-password");


        await User.findOneAndUpdate({ _id: req.user._id }, {
            $pull: { following: req.params.id }
        }, { new: true });

        res.send({ newUser })

    } catch (error) {
        res.status(500).send({ message: err.message });
    }
});

userRouter.get("/suggestionsUser", Auth, async (req, res) => {
    try {
        const newArr = [...req.user.following, req.user._id];

        const num = req.query.num || 10;

        const users = await User.aggregate([
            { $match: { _id: { $nin: newArr } } },
            { $sample: { size: Number(num) } },
            { $lookup: { from: "users", localField: "followers", foreignField: "_id", as: "followers" } },
            { $lookup: { from: "users", localField: "following", foreignField: "_id", as: "following" } }
        ]).project("-password");

        res.send({
            users,
            result: users.length
        });

    } catch (error) {
        res.status(500).send({ message: err.message });
    }
})


export default userRouter;