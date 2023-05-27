const jwt = require("jsonwebtoken");

const { User } = require('../models');
const { HttpErr } = require("../helpers");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpErr(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpErr(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpErr(401));
  }


};

module.exports = authenticate;
