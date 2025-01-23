// require('dotenv').config();
const jwt=require('jsonwebtoken')
// const secretKey=process.env.SECRET

// const cookieParser=require('cookie-parser')
// app.use(cookieParser());

const verify=(req,res,next)=>{
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    try {
        const token= req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

        // res.send({token});
        // console.log({token});
    
        if(!token)
        {
            return res.status(401).send('Unauthorized User, No Token Found')
        }
        jwt.verify(token,'k95k9878vomaacw8qk4pbxkme0yihht-dl4pic5dtmj099dz89mklrohvs522rsxej', (err,user)=>{
            if(err){
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send('Unauthorized User, Token has Expired');
                }
                return res.status(401).send(`Unauthorized User, Token Verification Failed`);
            }
            req.user=user;
            next();
        })
    
    } catch (error) {
        res.status(500).json({error})   
    }
}

module.exports={
    verify,
}