const mongoose=require('mongoose');

const uploadSchema=new mongoose.Schema({    
            uploadImage:[String]
})

const uploadpic=new mongoose.model('uploadpic',uploadSchema);
module.exports=uploadpic;