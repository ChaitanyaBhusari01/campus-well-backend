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
        res.status(400).json({message : "the user is not signed up"});
        return;
    }
    const compare = await bcrypt.compare(password,counsellor.password);  
    if(!compare){
        res.json({message : "password is incorrect"});
        return;
    }
    const token = JWT.sign(counsellor.email,JWT_COUNSELLOR_SECRET);
    localStorage.setItem({token : token});
    res.json({message : "user is signed up"})
    
});    

module.exports = {
    counsellorRouter : counsellorRouter,
}