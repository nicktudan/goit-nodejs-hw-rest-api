const { User } = require('../models');
const { HttpErr } = require("../helpers");
const { tryCatchWrapper } = require("../decorators");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpErr(409, "Email in use");
  }

  const newUser = await User.create(req.body);

  res.status(201).json({
    email: newUser.email,
  });
}

module.exports = {
  register: tryCatchWrapper(register),
};