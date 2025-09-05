require('dotenv').config();
const express = require ('express');
const JWT = require ('jsonwebtoken');
const mongoose = require('mongoose');
const {mongodburl, MONGODBURL} = require('./config');
const {PORT} = require('./config');

const app = express();
app.use(express.json());

const {adminRouter} = require('./routes/admin');
const {counsellorRouter} = require('./routes/counsellor');
const {studentRouter} = require('./routes/student');



app.use("/student",studentRouter);
app.use("/admin",adminRouter);
app.use("/counsellor",counsellorRouter);

async function main(){
    await mongoose.connect(MONGODBURL);
    app.listen(PORT,()=>{
        console.log(`lsitening on ${PORT}`);
    });
}
main();
