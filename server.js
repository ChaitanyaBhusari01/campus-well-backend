require('dotenv').config();
const express = require ('express');
const JWT = require ('jsonwebtoken');
const mongoose = require('mongoose');
const {mongodburl} = require('./config');
const {port} = require('./config');

const app = express();
app.use(express.json());

const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');
const {adminRouter} = require('./routes/admin');



app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

async function main(){
    await mongoose.connect(mongodburl);
    app.listen(port,()=>{
        console.log(`lsitening on ${port}`);
    });
}
main();
