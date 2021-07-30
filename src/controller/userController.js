"use strict";

const User=require('../models/userModel');
var jwt=require('jsonwebtoken');

exports.create= function(req,res){
    const new_user=new User(req.body);
    if(req.body.constructor===Object && Object.keys(req.body).length===0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        User.create(new_user,function(err,suc){
            if(err) res.send(err);

            if(suc=='Mobile Number Exists'){
                res.json({error:true,data:suc});
            }
            if(suc=='Username Exists'){
                res.json({error:true,data:suc});
            }
            if(suc=='Email ID Exists'){
                res.json({error:true,data:suc});
            }
            else{
                res.json({error:false,message:"User added successfully!",data:suc});
            }
        });
    }
}

exports.login=async function(req,res){
    try{
        const loginCred=new User(req.body);
        const {username,password}=req.body;
        if(!username||!password){
            return res.json({ error: true, errorMessage: "Invalid fields." });
        }else{
            User.login(loginCred,function(err,success){
                if(err) res.send(err);
                else{
                    res.json({data:success});
                }
            })
        }
    }catch(e){
        console.log(e);
    }
}

exports.editProfile=function(req,res){
    jwt.verify(req.body.token,"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",function(err,success){
        if(err){
            res.json(err.message);
        }else{
            try{
                const edit=req.params.id;     //new User(req.body);
                const{id,token}=req.body;
                if(!req.params.id||!token){
                    res.json('invalid request'); 
                }else{
                    User.editProfile(edit,function(err,response){
                        if(err) res.send(err);
                        res.json({data:response});
                    });
                }
            }catch(e){
                console.log(e);
            }
        }
    });
}

exports.usernameExists=function(req,res){
    jwt.verify(req.body.token,"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",function(err,response){
        if(err){
            res.json(err.message);
        }else{
            try{
                User.usernameExists(req.body.username,function(err,response){
                    if(err) res.send(err);
                    res.json({data:response});
                });
            }catch(e){
                console.log(e);
            }
        }
    });
}

exports.changePassword=function(req,res){
    jwt.verify(req.body.token,"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",function(err,response){
        if(err) res.json(err.message);
        try{
            User.changePassword(req.body,function(err,response){
                if(err) res.send(err);
                res.json({data:response});
            });
        }catch(e){
            console.log(e);
        }
    });
}

exports.verifyEmail=function(req,res){
    User.verifyEmail(req.body,function(err,response){
        if(err) throw err;
        res.json({data:response});
    });
}

exports.uploadProfilePicture=function(req,res){
    console.log(req);
    // User.uploadProfilePicture(req,function(err,response){
    //     if(err) throw err;
    //     res.json({data:response});
    // });
}

exports.welcome=function(req,res){
    //console.log(req.body.token);
    jwt.verify(req.body.token,"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",function(err,decode){
        if(err){
            console.log(err.message);
        }
        console.log(decode);
    });
}