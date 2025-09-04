const express = require('express');
const counsellorRouter = express.Router();
const {counsellorModel} = require('../db');
const  JWT  = require('jsonwebtoken');
const {counsellorauth} = require('../middlewares/studentauth');
const {JWT_COUNSELLOR_SECRET} = require ('../config');
const bcrypt = require('bcrypt');

counsellorRouter.post('/signup',async function (req,res){
    const {name ,email , password, campusId ,campusName,specialization } =req.body;
    const counsellor = await counsellorModel.findOne({
        email  : email,
    });
    if(counsellor){
       return res.status(400).json({ message: "counsellor already exists. Please login." }); 
    } 
    else{
        const hashedpassword = await bcrypt.hash(password,10);
        await counsellorModel.create({
            name : name,
            email : email,
            password : hashedpassword,
            campusId : campusId,
            campusName : campusName,
            specialization : specialization,
        });
        res.status(200).json({
            message : "counsellor is now signed up",
        })
    }
});    

counsellorRouter.post('/signin',async function (req,res){
    const {email , password} =req.body;
    const counsellor = await counsellorModel.findOne({
        email  : email,
    });
    if(!counsellor){
        return res.status(400).json({message : "the counsellor is not signed up"});
    }
    const match = await bcrypt.compare(password,counsellor.password);  
    if(!match){
        return res.json({message : "password is incorrect"});
        
    }
    const token = JWT.sign({email : counsellor.email},JWT_COUNSELLOR_SECRET);
    
    return res.json({message : "counsellor is signed in",token});
    
});    

module.exports = {
    counsellorRouter : counsellorRouter,
}