var express = require("express");
var router = express.Router();
const User = require("./users.js");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
require("dotenv").config(); // when this function runs it first finds .env files

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["email", "profile"],
    },
    async function verify(issuer, profile, cb) {
      try {
        let existingUser = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) {
          return cb(null, existingUser); //cb - callback
        } else {
          let newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          return cb(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  )
);

/* GET home page. */
router.get("/", function (req, res, next) {
  // if user is there then go to index page or else go to login page
  if (req.user) {
    res.render("index", { title: "Express" });
  } else {
    res.redirect("/login");
  }
});

// login route
router.get("/login", function (req, res, next) {
  // if there is no user then only render login page
  if (!req.user) {
    res.render("login");
  }
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
