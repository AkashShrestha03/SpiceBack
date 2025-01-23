const express=require('express');
const router=express.Router();

const login=require('../controller/login.controller')
const signupLimitter=require('../utils/limitter.js/signup.limitter')
const loginLimitter=require('../utils/limitter.js/login.limitter');
const verify = require('../utils/middleware/verifyToken');

router.post('/signup',signupLimitter,login.adminSignUp);
router.post('/login',loginLimitter,login.adminLogin);
router.get('/user',login.allUser);
router.get('/signout/:AdminId',verify.verify,login.userSignout);
router.put('/userUpdate/:AdminId',verify.verify,login.adminUpdate);

module.exports=router;