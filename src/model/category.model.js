const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({    
            name:{
                type:String,
                required:true,
                trim:true 
            },
            products:[Object],
})

const category=new mongoose.model('category',categorySchema);
module.exports=category;