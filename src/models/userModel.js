'use strict';

var connection=require('./../../database/connectionString');
const bcrypt = require ('bcrypt');
const jwt=require('jsonwebtoken');
var nodemailer=require('nodemailer');
//const jwtConfig=require('.env')
const saltRound=10;

var User=function(user){
  this.fullname=user.fullname;
  this.email=user.email;
  this.password=user.password;
  this.username=user.username;
  this.mobile=user.mobile;
  this.gender=user.gender;
}

User.create=async function(newUser,result){
   const {fullname,email,password,username,mobile,gender}=newUser;

  connection.query('SELECT COUNT(mobile) as mobilecount FROM users WHERE  mobile="'+mobile+'"',function(err,res){
    if(err) throw err;
    Object.keys(res).forEach(function(key){
      var row=res[key];
      if(row.mobilecount>0){
        result(null,'Mobile Number Exists');
      }
    })
  });

  connection.query('SELECT COUNT(email) as emailcount FROM users WHERE  email="'+email+'"',function(err,res){
    if(err) throw err;
    Object.keys(res).forEach(function(key){
      var row=res[key];
      if(row.emailcount>0){
        result(null,'Email ID Exists');
      }
    })
  });

  connection.query('SELECT COUNT(username) as usernamecount FROM users WHERE  username="'+username+'"',function(err,res){
    if(err) throw err;
    Object.keys(res).forEach(function(key){
      var row=res[key];
      if(row.usernamecount>0){
        result(null,'Username Exists');
      }
    })
  });

  bcrypt.genSalt(saltRound,function(saltError,salt){
    if(saltError) throw saltError;
    bcrypt.hash(password,salt,function(hashError,hash){
      if(hashError) throw hashError;
      var _password=hash;
      connection.query('INSERT INTO users (fullname,email,password,username,mobile,gender) values ("'+fullname+'","'+email+'","'+_password+'","'+username+'","'+mobile+'","'+gender+'")',function(err,res){
        if(err) throw err;
        result(null,res.insertId);
      });
    });
  });
}

User.login=function(req,res){
  connection.query('SELECT id,fullname,email,password,username,gender,token FROM users WHERE username="'+req.username+'"', function(err,success){
    if(err) throw err;
   Object.keys(success).forEach(async function(key){
     var row=success[key];
     const validatePassword=await bcrypt.compare(req.password,row.password);
     if(validatePassword){
      const token=jwt.sign({
        id:row.id,
      },"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",
      {
        expiresIn: '2h'
      });
      row.token=token;
      res(null,row);
     }
     else{
       res(null,'Wrong Password');
     }
    });
  });
}

User.editProfile=function(req,res){
  connection.query('SELECT id,fullname,email,mobile,username,gender from users WHERE id='+req,function(err,response){
    if(err) throw err;
    var resultArray = Object.values(JSON.parse(JSON.stringify(response)));
    res(null,resultArray);
   });
}

User.usernameExists=function(req,res){
  connection.query('SELECT COUNT(username) as usernameCount from users where username="'+req+'"',function(err,response){
    if(err) throw err;
    Object.keys(response).forEach(function(key){
      var row=response[key];
      if(row.usernameCount>0){
        res(null,"User Exists")
      }else{
        res(null,'User Not Found');
      }
    });
  });
}

User.changePassword=function(req,res){
  connection.query('SELECT id,password from users where id="'+req.id+'"',function(err,response){
    if(err) throw err;
    Object.keys(response).forEach(async function(key){
      var record=response[key];
      console.log(record.password);
      const validatePassword=await bcrypt.compare(req.oldPassword,record.password);
      if(validatePassword==true){
        bcrypt.genSalt(saltRound,function(saltError,salt){
          if(saltError) throw saltError;
          bcrypt.hash(req.newPassword,salt,function(hashError,_newPassword){
            if(hashError) throw hashError;
            connection.query('UPDATE users SET password="'+_newPassword+'" WHERE id="'+req.id+'"',function(err,result){
              if(err) throw err;
              res(null,result.updateID);
            });
          });
        });
      }else{
        res(null,'Please re-check your Old password!!');
      }
    });
  });
}

User.verifyEmail=function(req,res){
  //Email id of the new user will be provided by the mobile code  
    if(req.email!=''){
    var transporter=nodemailer.createTransport({
      service:'gmail',
      secure:false,
      port:25,
      auth:{
        user:'mail.development.noreply@gmail.com',
        pass:'dev@1234'
      },tls:{
        rejectUnauthorized:false
      }
    });

    var val = Math.floor(1000 + Math.random() * 9000);

    var mailOptions={
      from:'mail.development.noreply@gmail.com',
      to:'"'+req.email+'"',
      subject:'Registration Code',
      text:'"'+val+'"'
    };

    transporter.sendMail(mailOptions,function(error,info){
      if(error) throw error;
      res(null,info.response);
    });
    }
  }

  User.uploadProfilePicture=function(req,res){
    console.log(req.body);
  }

exports.welcome=function(req,res){
  jwt.verify(req.body.token,"AAAAPDyyf7o:APA91bEZ_rrqpVXI168agNIHTuN8y_EalcxfwC764rqHNA4GjB7ANQNVzOBRE7r1VHiUty-HIPb1Ke_cMxql7pQcdvxg2fDTnIFcFfrI5AqbFdJ2CCaFsCDlKDrAqcECwZTPzwW-pSvk",function(err,decode){
      if(err){
          console.log(err.message);
      }
      console.log(decode);
  });
}

module.exports=User;