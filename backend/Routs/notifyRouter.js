import express from 'express';
import { Auth } from '../Middelware/Auth.js';
import Notify from '../Models/notifyModel.js';


const notifyRouter = express.Router();


notifyRouter.post("/notify", Auth, async (req, res) => {
    try {
        const { id, recipients, url, text, content, image } = req.body;

        if (recipients.includes(req.user._id.toString())) return;

        const notify = new Notify({
            id, recipients, url, text, content, image, user: req.user._id
        });

        await notify.save();

        res.send({ notify });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

notifyRouter.delete("/notify/:id", Auth, async (req, res) => {
    try {
        const notify = await Notify.findOneAndDelete({
            id: req.params.id, url: req.query.url
        });

        res.send({ notify });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

notifyRouter.get("/notifies", Auth, async (req, res) => {
    try {
        const notifies = await Notify.find({ recipients: req.user._id })
            .sort("-createdAt").populate("user", "avatar username");

        res.send({ notifies });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

notifyRouter.patch("/isReadNotify/:id", Auth, async (req, res) => {
    try {
        const notifies = await Notify.findOneAndUpdate({ _id: req.params.id }, {
            isRead: true
        });

        res.send({ notifies });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

notifyRouter.delete("/deleteAllNotify", Auth, async (req, res) => {
    try {
        const notifies = await Notify.deleteMany({ recipients: req.user._id });

        res.send({ notifies });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})



export default notifyRouter;