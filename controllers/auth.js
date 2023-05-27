const bcrypt = require('bcrypt');

const { User } = require('../models');
const { HttpErr } = require("../helpers");
const { tryCatchWrapper } = require("../decorators");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpErr(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
  });
}

module.exports = {
  register: tryCatchWrapper(register),
};