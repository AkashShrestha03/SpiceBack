const mongoose=require('mongoose');
const validator=require('validator');
const loginSchema=new mongoose.Schema({
    firstname: {
        type:String,
        required:true,
        trim:true,
    },        
    lastname: {
        type:String,
        required:true,
        trim:true
    },
    username: {
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Write a Valid Email")
                }    
            } 
        }
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    refreshToken:{
        type:String, 
    }
},
{
    timestamps:true
}
)

const Users=mongoose.model('Users',loginSchema);
module.exports=Users;
