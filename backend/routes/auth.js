const { application } = require('express');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config');

router.get("/twitter", passport.authenticate("twitter"));


router.get("/login-success", (req, res, next) => {
    res.redirect("http://" + config.HOST + ":" + config.PORT ) ;
  });
  
router.get("/login-fail", (req, res, next) => {
    res.send("Login failed");
  });
  
  //redirect to /login-success after successfully login via Twitter.
router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/api/auth/login-success",
      failureRedirect: "/api/auth/login-fail",
    })
  );


router.get("/login/success", (req, res, next) => {
    if (req.user) {
      let user = {
        name: req.user.name,
        profileImageUrl: req.user.profileImageUrl,
        id: req.user._id,
        albums: req.user.albums,
      };
      res.json({ user: user });
    } else {
      console.log("user is NOT found");
      res.status(201);
      res.send({ message: "No user found" });
    }
    next();
  });
  

module.exports = router;
