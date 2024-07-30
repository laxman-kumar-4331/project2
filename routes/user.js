const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");
const { route } = require("./listing.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../Controller/users.js")


router.get("/signup",userController.pageSign)

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.pageLogin)

router.post("/login",saveRedirectUrl, passport.authenticate
    ("local",{failureRedirect: "/login", failureFlash: true}),
     userController.Login)

router.get("/logout",userController.pageLogout)

module.exports = router;