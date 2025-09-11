const express = require('express');
const studentRouter = express.Router();
const { studentModel, resourceModel ,bookingModel, counsellorModel , helplineModel} = require('../db');
const JWT = require('jsonwebtoken');
const { studentauth } = require('../middlewares/studentauth');
const { JWT_STUDENT_SECRET } = require('../config');
const bcrypt = require('bcrypt');

studentRouter.post('/signup', async function (req, res) {
  const { name, email, password, campusId, campusName } = req.body;
  const student = await studentModel.findOne({ email: email });
  if (student) {
    return res.status(400).json({ message: "Student already exists. Please login." });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  await studentModel.create({
    name: name,
    email: email,
    password: hashedpassword,
    campusId: campusId,
    campusName: campusName,
  });

  return res.status(201).json({ message: "Student is now signed up" });
});

studentRouter.post('/signin', async function (req, res) {
  const { email, password } = req.body;
  const student = await studentModel.findOne({ email: email });
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const match = await bcrypt.compare(password, student.password);
  if (!match) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const token = JWT.sign({ _id: student._id, email: student.email ,campusId :student.campusId }, JWT_STUDENT_SECRET);
  return res.status(200).json({ message: "Student signed in successfully", token });
});

studentRouter.get('/resource', studentauth, async function (req, res) {
  try {
    const resources = await resourceModel
      .find({ status: "approved" })
      .populate('uploadedBy', 'name specialization');

    return res.status(200).json({ resources });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Problem while loading the resources from the library" });
  }
});

studentRouter.get('/counsellors',studentauth ,async function(req,res){
  try{
    const campusId = req.student.campusId;
    const counsellors  = await counsellorModel.find({campusId}).select(-"password");
    if(counsellors.length === 0){
      return res.json({message : "there are no counsellors currently registered for your campus"});
    }
    return res.status(200).json({counsellors});
  }
  catch(error){
    return res.status(500).json({message : "problem while retrirving the counsellors from db"})
  }
});

studentRouter.post('/bookings/:counsellorId/:slot',studentauth,async function(req,res){

});

studentRouter.get('/helpline/:language',studentauth,async function (req,res){
  const language = req.params.language;
  try{
    const helplines = await helplineModel.find({language});
    if(helplines.lenght === 0){
      return res.status(403).json({message : "there are no helplines for the specified language"});
    }
    return res.status(200).json({helplines});

  }
  catch(error){
    return res.status(500).json({message :"problem in fetching the helplines from the DB"});
  }
});


module.exports = {
  studentRouter: studentRouter,
};
