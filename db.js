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

const ObjectId = mongoose.Schema.Types.ObjectId;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    campusName: { type: String, required: true },
},{ timestamps: true });

const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, 
            unique: true, 
            required: true ,
            trim : true ,
            lowercase : true
        },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    campusName: { type: String, required: true },
    bookings : [
        {
            startTime : String,
            endTime : String,
            counsellorId : {type : ObjectId , ref : "counsellor"},
            date : Date

        }
    ]
},{ timestamps: true });

const counsellorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  campusId: { type: String, required: true },
  campusName: { type: String, required: true },
  specialization: { type: String },  
  availability: [
    {
        date : {type : Date , required : true}, 
        day :{type : String} ,
        startTime : {type : String , required : true},
        endTime : {type : String , required : true},
        isbooked : {type : Boolean , default : 'false'}
    }
] 
},{ timestamps: true });


const resourceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["article", "video", "audio"], required: true },
    link: { type: String, required: true },
    status: { type: String, enum: ['approved', 'pending','rejected'], default: 'pending' },
    uploadedBy: { type: ObjectId, ref: "counsellor" ,}
},
{ timestamps: true});

const helplineSchema = new Schema({
    organization : {type : String , required : true},
    phoneNumber : {type : String , required : true},
    availability : {type : String ,required : true},
    type : {type : String,required : true},
    languages : [String]
});

const bookingSchema = new Schema ({
  studentId: {type : ObjectId,ref : "student"},
  counsellorId: {type : ObjectId,ref : "counsellor"},
  date: {type:Date},
  slot: String,
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  notes: String
},{timestamps : true});

const adminModel = mongoose.model("admin",adminSchema);
const studentModel = mongoose.model("student",studentSchema);
const counsellorModel = mongoose.model("counsellor",counsellorSchema);
const resourceModel = mongoose.model("resource",resourceSchema);
const helplineModel = mongoose.model("helpline",helplineSchema);
const bookingModel = mongoose.model ("booking",bookingSchema);

module.exports = {
    studentModel,
    adminModel,
    counsellorModel,
    resourceModel,
    helplineModel,
    bookingModel
};

 