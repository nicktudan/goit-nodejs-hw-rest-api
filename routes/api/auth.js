const express = require("express");

const { userController } = require('../../controllers');
const { userSchemas } = require("../../models");
const { validateBody, authenticate } = require("../../decorators");
const { upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(userSchemas.registerSchema),
  userController.register
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