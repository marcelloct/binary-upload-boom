const express = require("express");
const app = express();

// easier interact with mongodb
const mongoose = require("mongoose");

// handle our authentication
const passport = require("passport");

// creates the cookie session
const session = require("express-session");

// stores the session into the database and retrieve
const MongoStore = require("connect-mongo")(session);

const methodOverride = require("method-override");

const flash = require("express-flash");
const logger = require("morgan");

const connectDB = require("./config/database");

// routes
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

// Using EJS for views
app.set("view engine", "ejs");

// Static Folder
app.use(express.static("public"));

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging the request events that's happening
app.use(logger("dev"));

// Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, infos, etc...
app.use(flash());

// Setup Routes for which the server is listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running at: http://localhost:${process.env.PORT}`);
});

// TODOS
// Add new static files, like about us
