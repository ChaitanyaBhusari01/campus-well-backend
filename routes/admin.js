const express = require('express');
const {adminModel} = require('../db');
const adminRouter = express.Router();
const  JWT  = require('jsonwebtoken');
const {adminauth} = require('../middlewares/adminauth');
const {JWT_ADMIN_SECRET} = require ('../config');
const bcrypt = require('bcrypt');

adminRouter.post('/signup',async function (req,res){
    const {name ,email , password, campusId ,campusName } =req.body;
    const admin = await adminModel.findOne({
        email  : email,
        password : password,
    });
    if(admin){
       return res.status(400).json({ message: "Admin already exists. Please login." }); 
    } 
    else{
        const hashedpassword = await bcrypt.hash(password,10);
        await adminModel.create({
            name : name,
            email : email,
            password : hashedpassword,
            campusId : campusId,
            campusName : campusName,
        });
        res.status(200).json({
            message : "admin is now signed up",
        })
    }
});    

adminRouter.post('/signin',async function (req,res){
    const {email , password} =req.body;
    const admin = await adminModel.findOne({
        email  : email,
    });
    if(!admin){
        res.status(400).json({message : "the user is not signed up"});
        return;
    }
    const compare = await bcrypt.compare(password,admin.password);  
    if(!compare){
        res.json({message : "password is incorrect"});
        return;
    }
    const token = JWT.sign({email:admin.email},JWT_ADMIN_SECRET);
    
    res.json({message : "user is signed up",token})
    
});    

module.exports = {
    adminRouter : adminRouter,
}