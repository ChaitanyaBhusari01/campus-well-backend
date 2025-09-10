require ('dotenv').config();

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
const MONGODBURL = process.env.MONGODBURL;
const JWT_STUDENT_SECRET = process.env.JWT_STUDENT_SECRET;
const JWT_COUNSELLOR_SECRET = process.env.JWT_COUNSELLOR_SECRET;
const PORT = process.env.PORT;


module.exports = {
    JWT_ADMIN_SECRET,
    MONGODBURL,
    JWT_STUDENT_SECRET,
    JWT_COUNSELLOR_SECRET,
    PORT,
};
