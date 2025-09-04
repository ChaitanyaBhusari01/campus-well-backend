const express = require('express');
const mongoose = require('mongoose');

const { MONGODBURL } = require("./congig");

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
});

const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    campusName: { type: String, required: true },
});

const counsellorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  campusId: { type: String, required: true },
  campusName: { type: String, required: true },
  specialization: { type: String },  // optional: e.g., "Career", "Mental Health"
  availability: { type: Boolean, default: true } // whether counsellor is available for sessions
});

const adminModel = mongoose.model(adminSchema,admin);
const studentModel = mongoose.model(studentSchema,student);
const counsellorModel = mongoose.model(counsellorSchema,counsellor);

module.exports = {
    studentModel,
    adminModel,
    counsellorModel
};

 