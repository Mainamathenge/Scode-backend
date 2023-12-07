const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const Email = require("../utils/email");

// eslint-disable-next-line no-unused-vars
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

//Twitter
// router.get("/auth/twitter", passport.authenticate("twitter"));
// router.get(
//   "/auth/twitter/callback",
//   passport.authenticate("twitter", { failureRedirect: "/login" }),
//   // eslint-disable-next-line prefer-arrow-callback
//   function (req, res) {
//     // Successful authentication, redirect home
//     // console.log('user', req.user);
//     const token = signToken(req.user._doc._id);
//     // const token = jwt.sign({ userId: req.user._id });
//     const user = { ...req.user._doc, token };
//     res.redirect(
//       `${process.env.FRONTEND_URL}/register?user=${JSON.stringify(user)}`
//     );
//   }
// );

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
// router.post("/device/:id", userController.updatedevicelocation);

// Protect all routes after this middleware
router.use(authController.protect);
// router.patch("/update/interests", userController.updateInterests);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);

// router.patch(
//   "/updateMe",
//   userController.uploadUserDocs,
//   userController.updateMe
// );

// router.patch(
//   "/updateProfile",
//   userController.uploadUserPhoto,
//   userController.updateProfile
// );

// router.patch(
//   "/updateKyc",
//   userController.uploadUserKyc,
//   userController.updateKyc
// );
router.post("/", userController.createUser);
router.route("/").get(userController.getAllUsers);
router.delete("/deleteMe", userController.deleteMe);
router.post("/", userController.createUser);

router.patch("/update", userController.updateUser);

//protect to super-admin only

router.use(authController.restrictTo("super-admin", "admin"));

router.route("/:id").get(userController.getUser);
router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
