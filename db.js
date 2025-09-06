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
  specialization: { type: String },  
  availability: { type: Boolean, default: true } 
},{ timestamps: true });


const resourceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["article", "video", "audio"], required: true },
    link: { type: String, required: true },
    status: { type: String, enum: ['approved', 'pending','rejected'], default: 'pending' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "counsellor" ,}
},
{ timestamps: true});

const adminModel = mongoose.model("admin",adminSchema);
const studentModel = mongoose.model("student",studentSchema);
const counsellorModel = mongoose.model("counsellor",counsellorSchema);
const resourceModel = mongoose.model("resource",resourceSchema);

module.exports = {
    studentModel,
    adminModel,
    counsellorModel,
    resourceModel
};

 