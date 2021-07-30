var mysql=require('mysql');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer=require('multer');
const userRoutes=require('./src/routes/userroutes');

var con=mysql.createConnection({
    host:"localhost",
    user:"tickytapuser",
    password:"ashu@9769",
    database:'tickytap'
});

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./src/profileImages');
    },
    filename:function(req,file,cb){
        cb(null,"UploadedOn" + Date.now() + "fileOrigName" + file.originalname);
    }
});

var upload=multer({storage:storage});
 
con.connect(function(err){
 if(err) throw err;
 console.log('Connected');
});

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use("/tickytap/user", userRoutes);

app.use(express.json());
app.use(cors());

app.listen('5000', () => {
    console.log("Listening on port 5000");
});