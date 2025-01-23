require('dotenv').config();
const Users=require('../model/login.model');
// const secretKey=process.env.SECRET;
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const validatePassword=require('../utils/middleware/passwordValidation');
const generateAccessToken = require('../utils/token/generateAccessToken');
const generateRefreshToken = require('../utils/token/generateRefreshToken');

const adminSignUp=async(req,res)=>{
    const {firstname,lastname,username,email,password} = req.body 
    if(!firstname || 
        !lastname ||
        !username || 
        !email ||
        !password ||
        !firstname ==='' || 
        !lastname ==='' ||
        !username ===''|| 
        !email==='' ||
        !password==='')
     {
         return res.status(400).json(`All Fields are required`)
     }

     let existingUsername
     let existingEmail

     try { 
       existingUsername = await Users.findOne({username})
       existingEmail = await Users.findOne({email})
     } catch (error) {
        res.status(500).json({error})
     }

     if(existingEmail){
        res.status(400).json(`${email} email already exist. Enter a new one.`)
     }
     else if(existingUsername){
        res.status(400).json(`${username} username already exist. Enter a new one.`)
     }
     else
     {
        const isValidPassword=validatePassword(password)

        if(isValidPassword){
           try{
            const hashedPassword=bcryptjs.hashSync(password,10);
                const user=new Users({
                    firstname,
                    lastname,
                    username,
                    email,
                    password:hashedPassword,
            })
    
            const data=await user.save()
            return res.status(201).json(data)
    
         }catch(error)
         {
           return res.status(500).json(error)
         }
        }else{
           return res.status(400).json('enter a valid password')
        }
 
 }

}

const adminLogin=async(req,res)=>{
    const {email,password} = req.body

    if(
       !email ||
       !password ||
       email === '' ||
       password === '' 
   )
   {
     return res.status(400).json('All Fields are required')
   } 
  //  let userExist
   try { 
       const userExist=await Users.findOne({email})
      //  console.log(userExist);
       if(!userExist)
       {
         res.status(404).json(`Email ${email} not found. Enter a valid one`)
       }
       else
       { 
         const checkPassword=bcryptjs.compareSync(password,userExist.password)
           if (!checkPassword) {
             return res.status(400).json(`Wrong Password, Try Again`)
             } 
           else {
              
            const accessToken=await generateAccessToken(userExist._id)

            const refreshToken=await generateRefreshToken(userExist._id)

            // const { password: pass, ...rest }=userExist._doc;
            
            const loggedIn=await Users.findById(userExist._id).select("-password -refreshToken")

            const options={
              httpOnly: true,
              secure:true,
              sameSite:"None"
            }

            res 
               .status(201)
               .cookie('accessToken',accessToken,options)
               .cookie('refreshToken',refreshToken,options)
               .json(
                 {
                  user:loggedIn,
                  accessToken,
                  refreshToken
                 } 
                )
             }
       }
   } catch (error) {
    console.log(error);
    return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
   }
}

const allUser=async(req,res)=>{
  try {
    const users=await Users.find()
    if(users)
      {
        res.status(201).json({users})
      }
      else{
        res.status(404).josn('No user found')  
      }      
  } catch (error) {
    return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
  }
}

const adminUpdate=async(req,res)=>
  {
      if(req.user.id !== req.params.AdminId || req.user.isAdmin==false)   
      {
         return res.status(400).json('Unauthorized User. You are not allowed to update')
      }
      if(req.body.password){
          const isValidPassword = validatePassword(req.body.password)
          if(isValidPassword)
          {
              req.body.password = bcryptjs.hashSync(req.body.password,10)
          }
          else{
              return res.status(400).json('Enter A Valid Password')
          }
      }
      try {
          const updateUser= await Users.findByIdAndUpdate(req.params.AdminId,{
              $set:{
                  firstname:req.body.firstname,
                  lastname:req.body.lastname,
                  username: req.body.username,
                  email: req.body.email,
                  profilePicture: req.body.profilePicture,
                  password:req.body.password,
              },
          },
          {new: true}
          );
          const {password, ...rest} = updateUser._doc;
          return res.status(201).json(rest);
      } catch (error) {
        return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
      }
  }
 
const userSignout=async(req,res,next)=>{
  if(req.user.id !== req.params.AdminId)   
    {
       return res.status(400).json('Unauthorized User. You are not allowed to SIGNOUT');
    }
  try {
    // Check if token exists in the request cookies
    // console.log(req.cookies.accessToken);
    if (req.cookies.accessToken) {
        // If token exists, clear the cookie
        res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(200)
        .json('User has been Signed Out');
    } else {
        // If token doesn't exist, send an error response
        res.status(401).json('No User found');
    }
} catch (error) {
    return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
}
}

module.exports={
    adminSignUp,
    adminLogin,
    adminUpdate,
    allUser,
    userSignout
}