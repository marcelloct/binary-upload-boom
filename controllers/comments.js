const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  createComment: async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        user: req.user.id,
        post: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    // Mongoose's populate() is a crucial feature for managing relationships between data in MongoDB, where data is often stored in a denormalized fashion.
    // Simplifying, Get data from a relationship collection (ObjectId)
    const p = await Comment.findById(req.params.id).populate("post");
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${p.post._id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    const p = await Comment.findById(req.params.id).populate("post");
    try {
      // Delete post from db
      await Comment.deleteOne({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect(`/post/${p.post._id}`);
    } catch (err) {
      res.redirect(`/post/${p.post._id}`);
    }
  },
};
