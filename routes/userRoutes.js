const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const Email = require("../utils/email");

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
// Use passport
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CLIENT_ID,
//       consumerSecret: process.env.TWITTER_SECRET_KEY,
//       callbackURL: `${process.env.BASE_URL}/users/auth/twitter/callback`,
//       includeEmail: true,
//     },
//     // eslint-disable-next-line prefer-arrow-callback
//     async (token, tokenSecret, profile, cb) => {
//       // This function will be called after the user authorizes the app with Twitter
//       // You can save the user profile in your database or do any other necessary action here
//       const user = await User.findOne({
//         email: profile.emails[0].value,
//       });
//       if (user) {
//         return cb(null, user);
//       }
//       const createdUser = await User.create({
//         email: profile.emails[0].value,
//         password: profile.id,
//         passwordConfirm: profile.id,
//         userName: profile.username,
//         fullName: profile.displayName,
//         businessName: profile.username,
//       });
//       // const url = `${process.env.FRONTEND_URL}/login`;
//       // await new Email(createdUser, url).sendTwitterWelcome();
//       return cb(null, createdUser);
//     }
//   )
// );

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

//Twitter
router.get("/auth/twitter", passport.authenticate("twitter"));
router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  // eslint-disable-next-line prefer-arrow-callback
  function (req, res) {
    // Successful authentication, redirect home
    // console.log('user', req.user);
    const token = signToken(req.user._doc._id);
    // const token = jwt.sign({ userId: req.user._id });
    const user = { ...req.user._doc, token };
    res.redirect(
      `${process.env.FRONTEND_URL}/register?user=${JSON.stringify(user)}`
    );
  }
);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/device/:id", userController.updatedevicelocation);

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

router.delete("/deleteMe", userController.deleteMe);
router.post("/", userController.createUser);
router.route("/:id").get(userController.getUser);

//protect to super-admin only

router.use(authController.restrictTo("super-admin", "admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
