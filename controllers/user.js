const cloudinary = require("../middleware/cloudinary");
const fs = require("fs"); // file system
const Post = require("../models/Post");
const User = require("../models/User");

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
  updatePhoto: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) return res.status(404).send("User not found");

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "photos",
        width: 300,
        height: 300,
        crop: "fill",
        resource_type: "image",
      });

      // Delete old avatar (only if it's not your default one)
      const DEFAULT_PHOTO_URL =
        "https://res.cloudinary.com/dsxfaroro/image/upload/v1765486472/default-avatar-icon-of-social-media-user-vector_tgl3mz.jpg";

      if (user.photo && user.photo !== DEFAULT_PHOTO_URL) {
        const publicId = user.photo.split("/").pop().split(".")[0]; // extract ID
        await cloudinary.uploader.destroy(`photos/${publicId}`);
      }

      // Remove temporary file
      fs.unlinkSync(req.file.path);

      // Save Cloudinary URL
      user.photo = result.secure_url;
      await user.save();

      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading avatar");
      // req.flash("errors", {
      //   msg: "Error uploading avatar",
      // });
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
};
