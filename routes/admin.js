const express = require('express');
const { adminModel, resourceModel } = require('../db');
const adminRouter = express.Router();
const JWT = require('jsonwebtoken');
const { adminauth } = require('../middlewares/adminauth');
const { JWT_ADMIN_SECRET } = require('../config');
const bcrypt = require('bcrypt');

adminRouter.post('/signup', async function (req, res) {
  const { name, email, password, campusId, campusName } = req.body;
  const admin = await adminModel.findOne({ email: email });
  if (admin) {
    return res.status(400).json({ message: "Admin already exists. Please login." });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  await adminModel.create({
    name: name,
    email: email,
    password: hashedpassword,
    campusId: campusId,
    campusName: campusName,
  });
  res.status(201).json({ message: "Admin is now signed up" });
});

adminRouter.post('/signin', async function (req, res) {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email: email });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const compare = await bcrypt.compare(password, admin.password);
  if (!compare) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const token = JWT.sign({ _id: admin._id, email: admin.email,campusId : admin.campusId }, JWT_ADMIN_SECRET);
  res.status(200).json({ message: "Admin signed in successfully", token });
});

adminRouter.get('/resource', adminauth, async function (req, res) {
  try {
    const resources = await resourceModel
      .find({ status: "pending" })
      .populate("uploadedBy", "name specialization");

    return res.status(200).json({ resources });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Problem in fetching the resources from the DB" });
  }
});

adminRouter.patch('/resource/:id/approved', adminauth, async function (req, res) {
  const resourceId = req.params.id;
  if (!resourceId) {
    return res.status(400).json({ message: "No Id of resource is present in the params" });
  }

  try {
    const result = await resourceModel.updateOne(
      { _id: resourceId },
      { $set: { status: "approved" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Resource already approved" });
    }

    return res.status(200).json({ message: "Resource approved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Problem in approving the resource" });
  }
});

adminRouter.patch('/resource/:id/rejected', adminauth, async function (req, res) {
  const resourceId = req.params.id;
  if (!resourceId) {
    return res.status(400).json({ message: "No Id of resource is present in the params" });
  }

  try {
    const result = await resourceModel.updateOne(
      { _id: resourceId },
      { $set: { status: "rejected" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Resource already rejected" });
    }

    return res.status(200).json({ message: "Resource rejected successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Problem in rejecting the resource" });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
