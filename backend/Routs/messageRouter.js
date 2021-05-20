import express from 'express';
import Message from '../Models/messageModel.js'
import Conversation from '../Models/conversationModel.js'
import { Auth } from '../Middelware/Auth.js';
import { APIfeatures } from '../utils.js';



const messageRouter = express.Router();

messageRouter.post("/message", Auth, async (req, res) => {
    try {
        const { sender, recipient, text, media, call } = req.body;

        if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

        const newConversation = await Conversation.findOneAndUpdate({
            $or: [
                { recipients: [sender, recipient] },
                { recipients: [recipient, sender] }
            ]
        }, {
            recipients: [sender, recipient],
            text, media, call
        }, { new: true, upsert: true });

        const newMessage = new Message({
            conversation: newConversation._id,
            sender,
            recipient, text, media, call
        });

        await newMessage.save();

        res.send({ message: "Create success!" })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

messageRouter.get("/conversations", Auth, async (req, res) => {
    try {
        const features = new APIfeatures(Conversation.find({
            recipients: req.user._id
        }), req.query).paginating();

        const conversation = await features.query.sort("-updatedAt")
            .populate("recipients", "avatar username fullname");

        res.send({
            conversation,
            result: conversation.length
        })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

messageRouter.get("/message/:id", Auth, async (req, res) => {
    try {
        const features = new APIfeatures(Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.id },
                { sender: req.params.id, recipient: req.user._id }
            ]
        }), req.query).paginating();

        const messages = await features.query.sort("-createdAt");

        res.send({
            messages,
            result: messages.length
        })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

messageRouter.delete("/message/:id", Auth, async (req, res) => {
    try {
        await Message.findOneAndDelete({ _id: req.params.id, sender: req.user._id });

        res.send("Delete Success!");
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


messageRouter.delete("/conversation/:id", Auth, async (req, res) => {
    try {
        const newConver = await Conversation.findOneAndDelete({
            $or: [
                { recipients: [req.user._id, req.params.id] },
                { recipients: [req.params.id, req.user._id] }
            ]
        });

        await Message.deleteMany({ conversation: newConver._id });

        res.send("Delete Success!");
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})



export default messageRouter;