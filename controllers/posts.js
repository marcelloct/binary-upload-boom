const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user);
    try {
      // Since we have a session each request contains the logged-in users info: req.user
      // Grabbing just the post of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      // Sending post and user data feom mongodb to ejs
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const posts = await Post.find({ user: req.params.id });
      res.render("user.ejs", { posts: posts, user: user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      // req.params.id parameter comes from post routes. router.get("/:id")
      // e.g(localhost::8000/4jf375g478j)
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();
      res.render("post.ejs", {
        post: post,
        user: req.user,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // the above cloudinary request responds with url to media and media id that you will need when deleting content from there
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  toggleLike: async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) return res.status(404).json({ message: "Post not found" });

      const hasLiked = post.likedBy.includes(userId);

      if (hasLiked) {
        // Remove LIKE
        await Post.findByIdAndUpdate(postId, {
          $pull: { likedBy: userId },
          $inc: { likes: -1 },
        });

        return res.json({ liked: false });
      } else {
        // Add LIKE
        await Post.findByIdAndUpdate(postId, {
          $addToSet: { likedBy: userId }, // prevents duplicates
          $inc: { likes: +1 },
        });

        return res.json({ liked: true });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
