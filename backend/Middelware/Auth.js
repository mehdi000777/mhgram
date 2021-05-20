import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';


export const Auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(400).send({ message: "Invalid Authentication" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'somethingsecretgenerate');
        if (!decoded) return res.status(400).send({ message: "Invalid Authentication" });

        const user = await User.findOne({ _id: decoded._id });
        req.user = user;
        next();

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}