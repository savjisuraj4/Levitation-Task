import express from "express";
import { postModel } from "./postModel.js";
import authenticate from "./checkLogin.js";
import { body, validationResult } from 'express-validator';

const postRouter = express.Router();

postRouter.post("/createpost",[
  body('title').trim().escape(),
  body('content').trim().escape()
], authenticate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, content } = req.body;
    const newPost = new postModel({ title, content, author: req.user.userId })
    await newPost.save()
        .then((response) => {
            res.send("Post Created Successfully!!").status(201);
        })
        .catch((error) => {
            res.send(error.mesage).status(error.code);
        })
})
postRouter.get('/getpost', async (req, res) => {
    try {
        const { postId } = req.body;
        if (!postId) {
            // for all Blog Post API
            const posts = await postModel.find();
            return res.json(posts);
        }
        else {
            // for Individual Blog Post API
            const posts = await postModel.find({ _id: postId });
            return res.json(posts);

        }
    } catch (error) {
        res.status(500).send('Error fetching posts');
    }
});
postRouter.put('/updatepost', authenticate, async (req, res) => {
    try {

        const { postId, title, content } = req.body;
        const post = await postModel.findOne({ _id: postId, author: req.user.userId });
        if (!post) {
            return res.status(404).send('Post not found or unauthorized');
        }
        post.title = title;
        post.content = content;
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating post');
    }
});
postRouter.delete("/deletepost", authenticate, async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await postModel.findOne({ _id: postId, author: req.user.userId });
        if (!post) {
            return res.status(404).send('Post not found or unauthorized');
        }
        await post.deleteOne();
        res.send('Post deleted successfully!!').status(201);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting post');
    }
})

export default postRouter;