const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed');
const isAuth = require("../middleware/is-auth");


// GET /feed/posts
router.get("/posts",isAuth,  feedController.getPosts);

// POST /feed/post
router.post("/post",isAuth ,feedController.createPost);
// get single post
router.get("/post/:postId",isAuth, feedController.getPost);
// update post
router.put("/post/:postId",isAuth, feedController.update)
// delete post
router.delete("post/:postId",isAuth, feedController.delete);

module.exports = router;
