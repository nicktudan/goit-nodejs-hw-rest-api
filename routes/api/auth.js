const express = require("express");

const { userController } = require('../../controllers');
const { userSchemas } = require("../../models");
const { validateBody, authenticate } = require("../../decorators");

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

module.exports = router;