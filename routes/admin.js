const express = require('express');
const adminRouter = express.Router();
const  JWT  = require('jsonwebtoken');
const {adminauth} = require('../middlewares/adminauth');
const {JWT_ADMIN_SECRET} = require ('../config');

adminRouter.post('/signup',async function (req,res){
    const {name ,email , password, campusId ,campusName } =req.body;
    const admin = await adminModel.findOne({
        email  : email,
        password : password,
    });
    if(admin) res.send("admin is already signedup u can login now");
    else{
        await adminModel.create({
            name : name,
            email : email,
            password : password,
            campusId : campusId,
            campusName : campusName,
        });
        res.status(200).json({
            message : "admin is now signed up",
        })
    }
});    







module.exports = {
    adminRouter : adminRouter,
}