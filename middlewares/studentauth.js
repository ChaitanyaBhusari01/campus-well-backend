const jwt = require("jsonwebtoken");
const { JWT_STUDENT_SECRET } = require("../config");
const {studentModel} = require("../db");

const studentauth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_STUDENT_SECRET);


    req.student_id = decoded._id
    const student = await studentModel.findById(decoded._id).select("-password");
    req.student = student;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { studentauth };