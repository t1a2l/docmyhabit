require("dotenv").config();
const types = require('./types');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/html" }));

app.use(
  session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } ,
    store: new MongoStore({
      url: "mongodb://localhost:27017/docmyhabitDB",
      collection: 'sessions',
      unset: 'destroy'
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://ec2-54-152-212-119.compute-1.amazonaws.com:3000");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  //res.setHeader("Content-type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});

mongoose.connect("mongodb://localhost:27017/docmyhabitDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

const actionTypeSchema = new mongoose.Schema({
  actionName: String
});

const locationTypeSchema = new mongoose.Schema({
  locationName: String
});

const actionSchema = new mongoose.Schema({
  email: String,
  actions: Array
});

const ActionType = mongoose.model("ActionType", actionTypeSchema);

const LocationType = mongoose.model("LocationType", locationTypeSchema);

const Actions = mongoose.model("Action", actionSchema);

types.createType(ActionType, "actionName", "עישון");

types.createType(ActionType, "actionName", "אלכוהול");

types.createType(LocationType, "locationName", "בית");

types.createType(LocationType, "locationName", "עבודה");

types.createType(LocationType, "locationName", "רכב");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://ec2-54-152-212-119.compute-1.amazonaws.com:4000/auth/google/docmyhabit",
      passReqToCallback: true
    },
    function(accessToken, refreshToken, profile, db) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        } else if (!user) {
          //create user User.create...
          return done(null, createdUser);
        } else {
          //add this else
          return done(null, user);
        }
      });
    }
  )
);

app.get("/", function(req, res) {
  res.send("The server is working correctly!\n");
});

app.get("/favicon.ico", function(req, res) {
  res.status(204);
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

function loggedIn(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.send("fail");
  }
}

app.get("/Main", loggedIn, function(req, res) {
  res.send("success");
});

app.get("/Logout", loggedIn, function(req, res) {
  req.session.destroy(error => {
    req.session = null;
    if (error) return next(error);
    res.send("success")
  });
});

app.post("/Register", function(req, res) {
  if(req.body.password !== req.body.passwordApprove) {
    res.send("הסיסמאות אינן תואמות!");
  }
  User.register({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      res.send(err.message);
    } else if (!user) {
      res.send("הרשמה נכשלה!");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.send("success");
      });
    }
  });
});

app.post("/Login", function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      res.send(err);
    }
    if (user) {
      req.login(user, (err) => {
        if (err) { return next(err); }
        res.send("success");
      });
    } else {
      res.send("הייתה בעיה בהתחברות");
    }
  })(req, res, next);
});

app.get("/newActionInfo", loggedIn, function(req, res) {
  let resultsArr = [];
  ActionType.find({},{actionName:1}, function(err, results){
    if(err) {
      console.log(err);
    } else {
      resultsArr.push(results);
      LocationType.find({},{locationName:1}, function(err, results){
        if(err) {
          console.log(err);
        } else {
          resultsArr.push(results);
          res.send(resultsArr);
        }
      });
    }
  });
});

app.post("/newActionInfo", loggedIn, function(req, res) {
  Actions.findOne({ email: req.user.email }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if(result === null) {
        let actions = [];
        actions.push(req.body);
        Actions.create({ email: req.user.email, actions: [{
          key: mongoose.Types.ObjectId(),
          actionType: req.body.actionType, 
          actionDateTime: req.body.actionDateTime,
          actionLocation: req.body.actionLocation,
          actionContext: req.body.actionContext,
        
        }] }, function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send("success");
          }
        });
      } else {
        Actions.updateOne(
          { email: req.user.email }, 
          {$push: { actions: {
            key: mongoose.Types.ObjectId(),
            actionType: req.body.actionType, 
            actionDateTime: req.body.actionDateTime,
            actionLocation: req.body.actionLocation,
            actionContext: req.body.actionContext,          
          }}}, function(err, result) {
            if(err) {
              console.log(err);
            } else {
              res.send("success");
            }
        });
      }
    } 
  });
});

app.get("/Actions", loggedIn, function(req, res) {
  Actions.findOne({ email: req.user.email }, function(err, results){
    if(err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

// app.post("/DeleteActions", loggedIn, function(req, res) {
//   console.log(req.body.actions[0]);
//   Actions.update({ email: "talrofeh@gmail.com" }, { $pull: {actions: { key: ObjectId("5e6f675aeaabed14cc4bbeea") }}}), function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     } 
//   });
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
