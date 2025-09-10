const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const {adminModel} = require("../db");

const adminauth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);


    req.admin_id = decoded._id
    const admin = await adminModel.findById(decoded._id).select("-password");
    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};