const Post = require("../models/posts");

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocument()
    .then((post) => {
      totalItems = post;
      Post.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .then((result) => {
          res.status(200).json({
            posts: result,
            totalItems: totalItems,
            message: "successful",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;
  // Create post in db
  if (!image) {
    const error = new Error("image not found");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = image.path;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: "josh",
  });
  return post
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      // console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((result) => {
      res.status(200).json({
        message: "Post fetched successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  const prodId = req.params.prodId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("no file picked");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(prodId)
    .then((post) => {
      if (!post) {
        const error = new Error("post nit found");
        error.statusCode = 500;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  const prodId = req.params.postId;
  Post.findById(prodId)
    .then((post) => {
      if (!post) {
        const error = new Error("post not found");
        error.statusCode = 500;
        throw error;
      }
      Post.findByIdAndRemove(prodId).then((result) => {
        res.status(200).json({
          message: "Post deleted successfully!",
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
