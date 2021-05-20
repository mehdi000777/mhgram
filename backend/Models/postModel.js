import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    content: String,
    images: { type: Array, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    user: { type: mongoose.Types.ObjectId, ref: "User" }
},
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
