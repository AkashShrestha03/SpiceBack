const express=require('express');
const router=express.Router();

const cartCon=require('../controller/cart.controller')
const verify=require('../utils/middleware/verifyToken')

router.post('/addToCart/:AdminId',verify.verify,cartCon.addToCart);
router.put('/removeFromCart/:AdminId',verify.verify,cartCon.removeFromCart);
router.get('/getCart/:AdminId',verify.verify,cartCon.getCart);


module.exports=router;