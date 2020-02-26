require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/docmyhabitDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/docmyhabit"
    },
    function(accessToken, refreshToken, profile, db) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function(req, res) {
  res.send("The server is working correctly!");
});

app.get('/favicon.ico', function(req, res) {
  res.status(204)
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/docmyhabit",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.send("success");
  }
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res) {
  User.register({ email: req.body.email }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
      res.send("fail");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.send("success");
      });
    }
  });
});

app.post("/Login", function(req, res) {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.send("success");
      });
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
