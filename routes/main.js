const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const userController = require("../controllers/user");
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes
router.get("/", homeController.getIndex);
router.get("/user/:id", userController.getUser);
router.get("/profile", ensureAuth, userController.getProfile);
router.patch(
  "/photo",
  ensureAuth,
  upload.single("photo"),
  userController.updatePhoto
);
router.get("/feed", ensureAuth, postsController.getFeed);

// Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
