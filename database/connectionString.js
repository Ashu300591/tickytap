"use strict";
var mysql=require('mysql'); 

var con=mysql.createConnection({
    host:"localhost",
    user:"tickyuser",
    password:"123456",
    database:'tickytap',
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;