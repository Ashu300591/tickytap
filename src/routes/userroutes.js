const express=require('express');
const route=express.Router();

const userController=require('../controller/userController');

route.post('/create',userController.create);

route.post('/login',userController.login);

route.post('/edit/:id',userController.editProfile);

route.post('/usernameExists',userController.usernameExists);

route.post('/changePassword/:id',userController.changePassword);

route.post('/verifyEmail',userController.verifyEmail);

route.post('/uploadProfilePicture',userController.uploadProfilePicture);

route.post('/welcome',userController.welcome);

module.exports=route;
