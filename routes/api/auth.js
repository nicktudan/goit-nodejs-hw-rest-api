const express = require("express");

const { userController } = require('../../controllers');
const { userSchemas } = require("../../models");
const {validateBody} = require("../../decorators");

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


module.exports = router;