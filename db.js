const express = require('express');
const mongoose = require('mongoose');

const { MONGODBURL } = require("./config");
mongoose.connect(MONGODBURL)
.then(()=>{
    console.log("mongodb connected successfully");
})
.catch((error)=>{
    console.log(`error in connecting to the database ${error}`);
})
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    campusName: { type: String, required: true },
},{ timestamps: true });

const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    campusName: { type: String, required: true },
},{ timestamps: true });

const counsellorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  campusId: { type: String, required: true },
  campusName: { type: String, required: true },
  specialization: { type: String },  // optional: e.g., "Career", "Mental Health"
  availability: { type: Boolean, default: true } // whether counsellor is available for sessions
},{ timestamps: true });

const adminModel = mongoose.model("admin",adminSchema);
const studentModel = mongoose.model("student",studentSchema);
const counsellorModel = mongoose.model("counsellor",counsellorSchema);

module.exports = {
    studentModel,
    adminModel,
    counsellorModel
};

 