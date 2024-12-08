const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed');
// const isAuth = require("../middleware/is-auth");


// GET /feed/posts
router.get("/posts",  feedController.getPosts);

// POST /feed/post
router.post("/post", feedController.createPost);
// get single post
router.get("/post/:postId", feedController.getPost);
// update post
router.put("/post/:postId", feedController.update)
// delete post
router.delete("post/:postId", feedController.delete);

module.exports = router;