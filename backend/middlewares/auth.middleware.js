const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

exports.authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({message: "Token not provided."});
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({message: "token is invalid"});
  }

  try {
    const secretKey = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({message: "Invalid token."});
  }
};
