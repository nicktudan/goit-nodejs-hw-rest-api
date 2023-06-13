const express = require("express");

const { userController } = require('../../controllers');
const { userSchemas } = require("../../models");
const { validateBody } = require("../../decorators");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(userSchemas.registerSchema),
  userController.register
);

router.get("/verify/:verificationToken", userController.verify);

router.post(
  "/verify",
  validateBody(userSchemas.emailSchema),
  userController.resendVerifyEmail
);

router.post(
  "/login",
  validateBody(userSchemas.loginSchema),
  userController.login
);

router.get("/current", authenticate, userController.getCurrent);

router.post("/logout", authenticate, userController.logout);

router.patch(
  "/subscription",
  authenticate,
  validateBody(userSchemas.updateSubscriptionSchema),
  userController.updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  userController.updateAvatar
);

module.exports = router;