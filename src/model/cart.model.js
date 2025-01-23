const mongoose=require('mongoose');

const cartItemSchema=new mongoose.Schema({
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:0,
        min:[0, 'Quantity cannot be less than 0']
    },
    price:{
        type:Number,
        required:true,
        default:0,
        min:[0, 'Quantity cannot be less than 0']
    }  
})

const cartSchema=new mongoose.Schema({
    userID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true  
    },
    items:[cartItemSchema]
})

const Cart=mongoose.model('Cart',cartSchema)

module.exports=Cart;
