const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        require:true,
        trim:true,
    },
    productDescription:{
        type:String,
        require:true,
        trim:true,  
    },
    productExpiry:{
        type:String,
        require:true,
        trim:true,  
    },
    productMRP:{
        type:Number,
        require:true,
        trim:true,  
    },
    productPrice:{
        type:Number,
        require:true,
        trim:true,  
    },
    productQuantity:{
        type:Number,
        require:true,
        trim:true
    },
    productCategory:{
        type:String,
        require:true,
        trim:true,
    },
    productPicture:[String]

})

const product=new mongoose.model('product',productSchema);
module.exports=product;
