const express = require('express');
const counsellorRouter = express.Router();
const { counsellorModel, resourceModel } = require('../db');
const JWT = require('jsonwebtoken');
const { counsellorauth } = require('../middlewares/counsellorauth');
const { JWT_COUNSELLOR_SECRET } = require('../config');
const bcrypt = require('bcrypt');

counsellorRouter.post('/signup', async function (req, res) {
  const { name, email, password, campusId, campusName, specialization } = req.body;

  const counsellor = await counsellorModel.findOne({ email: email });
  if (counsellor) {
    return res.status(400).json({ message: "Counsellor already exists. Please login." });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  await counsellorModel.create({
    name,
    email,
    password: hashedpassword,
    campusId,
    campusName,
    specialization,
  });

  return res.status(201).json({ message: "Counsellor signed up successfully" });
});

counsellorRouter.post('/signin', async function (req, res) {
  const { email, password } = req.body;

  const counsellor = await counsellorModel.findOne({ email: email });
  if (!counsellor) {
    return res.status(404).json({ message: "Counsellor not found. Please signup." });
  }

  const match = await bcrypt.compare(password, counsellor.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = JWT.sign(
    { _id: counsellor._id,
      email: counsellor.email,
      campusId : counsellor.campusId
    },
    JWT_COUNSELLOR_SECRET
  );

  return res.status(200).json({ message: "Counsellor signed in successfully", token });
});

counsellorRouter.post('/resource', counsellorauth, async function (req, res) {
  const { title, description, type, link } = req.body;

  try {
    const resource = await resourceModel.create({
      title,
      description,
      type,
      link,
      status: 'pending',
      uploadedBy: req.counsellor._id,
    });

    return res.status(201).json({ message: "Resource uploaded successfully", resource });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading the resource", error: error.message });
  }
});

module.exports = {
  counsellorRouter: counsellorRouter,
};
