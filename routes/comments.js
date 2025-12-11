const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
// router.get("/:id", commentsController.getComment);

router.post("/createComment/:id", ensureAuth, commentsController.createComment);

router.post("/:id/likeComment", ensureAuth, commentsController.toggleLike);

router.delete(
  "/deleteComment/:id",
  ensureAuth,
  commentsController.deleteComment
);

module.exports = router;
