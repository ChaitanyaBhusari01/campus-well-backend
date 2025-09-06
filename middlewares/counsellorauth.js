const jwt = require("jsonwebtoken");
const { JWT_COUNSELLOR_SECRET } = require("../config");
const {counsellorModel} = require("../db");

const counsellorauth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_COUNSELLOR_SECRET);


    req.counsellor_id = decoded._id
    const counsellor = await counsellorModel.findById(decoded._id).select("-password");
    req.counsellor = counsellor;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { counsellorauth };