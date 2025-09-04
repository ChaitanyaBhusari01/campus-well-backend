const express = require('express');
const studentRouter = express.Router();
const  JWT  = require('jsonwebtoken');
const {studentauth} = require('../middlewares/studentauth');
const {JWT_STUDENT_SECRET} = require ('../config');
const bcrypt = require('bcrypt');

studentRouter.post('/signup',async function (req,res){
    const {name ,email , password, campusId ,campusName } =req.body;
    const student = await studentModel.findOne({
        email  : email,
    });
    if(student){
       return res.status(400).json({ message: "student already exists. Please login." }); 
    } 
    else{
        const hashedpassword = await bcrypt.hash(password,10);
        await studentModel.create({
            name : name,
            email : email,
            password : hashedpassword,
            campusId : campusId,
            campusName : campusName,
        });
        res.status(200).json({
            message : "student is now signed up",
        })
    }
});    

studentRouter.post('/signin',async function (req,res){
    const {email , password} =req.body;
    const student = await studentModel.findOne({
        email  : email,
    });
    if(!student){
        res.status(400).json({message : "the user is not signed up"});
        return;
    }
    const compare = await bcrypt.compare(password,student.password);  
    if(!compare){
        res.json({message : "password is incorrect"});
        return;
    }
    const token = JWT.sign(student.email,JWT_STUDENT_SECRET);
    localStorage.setItem({token : token});
    res.json({message : "user is signed up"})
    
});    

module.exports = {
    studentRouter : studentRouter,
}