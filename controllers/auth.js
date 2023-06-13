const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require('../models');
const { HttpErr, sendEmail } = require("../helpers");
const { tryCatchWrapper } = require("../decorators");

const { SECRET_KEY, PROJECT_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpErr(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${verificationToken}">Click on verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpErr(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

  res.json({
    message: "Verification successful"
  });
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    throw HttpErr(400, "Missing required field email");
  }
  if (!user) {
    throw HttpErr(404, "User not found");
  }
  if (user.verify) {
    throw HttpErr(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationToken}">Click on verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpErr(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpErr(401, "Email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpErr(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "Logout success" });
}

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const image = await Jimp.read(tempUpload);
  const imageResize = await image.resize(250, 250);
  await imageResize.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: tryCatchWrapper(register),
  verify: tryCatchWrapper(verify),
  resendVerifyEmail: tryCatchWrapper(resendVerifyEmail),
  login: tryCatchWrapper(login),
  getCurrent: tryCatchWrapper(getCurrent),
  logout: tryCatchWrapper(logout),
  updateSubscription: tryCatchWrapper(updateSubscription),
  updateAvatar: tryCatchWrapper(updateAvatar),
};