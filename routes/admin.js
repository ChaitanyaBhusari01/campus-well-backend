const express = require('express');
const adminRouter = express.Router();
const {courseModel} = require('../db');
const {adminModel} = require('../db');
const  JWT  = require('jsonwebtoken');
const {adminauth} = require('../middlewares/adminauth');
const {JWT_ADMIN_SECRET} = require ('../config');

adminRouter.post('/signup',async function (req,res){
    const {email , password, first_Name , last_Name } =req.body;
    const admin = await adminModel.findOne({
        email  : email,
        password : password,
    });
    if(admin) res.send("admin is already signedup u can login now");
    else{
        await adminModel.create({
            email : email,
            password : password,
            first_Name : first_Name,
            last_Name : last_Name
        });
        res.status(200).json({
            message : "admin is now signed up",
        })
    }