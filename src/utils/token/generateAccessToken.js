const jwt=require('jsonwebtoken');
const Users = require('../../model/login.model');

const generateAccessToken=async(id)=>{
    try {
           const user=await Users.findById(id)

            const accessToken= jwt.sign(
                {
                  id:user._id,
                  isAdmin:user.isAdmin,
                  firstname:user.firstname,
                  lastname:user.lastname,
                  username:user.username,
                  email:user.email
                },'k95k9878vomaacw8qk4pbxkme0yihht-dl4pic5dtmj099dz89mklrohvs522rsxej',{
                expiresIn:"3m",
            });

            return accessToken

    } catch (error) {
        // return next(ApiErrors(500,`Something went wrong while generating access token . Error: ${error}`)) 
        res.status(500).json(`Something went wrong while generating access token . Error: ${error}`)
    }
}
module.exports=generateAccessToken 