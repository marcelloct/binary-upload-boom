const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getSearchResults: async (req, res) => {
    try {
      const q = req.query.q?.trim();

      if (!q) {
        return res.render("search.ejs", {
          users: [],
          posts: [],
          query: "",
        });
      }

      const regex = new RegExp(q, "i"); // case-insensitive

      const [users, posts] = await Promise.all([
        User.find({ userName: regex }).select("userName photo"),
        Post.find({ title: regex }).select("title createdAt"),
      ]);

      res.render("search.ejs", {
        users,
        posts,
        query: q,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Search error");
    }
  },
};
