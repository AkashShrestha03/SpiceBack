// require('dotenv').config();
require('./database/ZM.database');


const express=require('express');
const app=express()
const helmet=require('helmet');
const cors=require('cors');
const cookieParser=require('cookie-parser')
// const bodyParser=require('body-parser');
const port= 7000;
const loginRoute=require('./router/login.route');
const productRoute=require('./router/product.router') 
const cartRoute=require('./router/cart.router')
const multer=require('multer');

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({extended:true},{limit:"16kb"}))

// app.use(express.static("uploads"));

app.use(cookieParser());

// app.use(helmet());

// app.use(cors({
//     origin: ["http://localhost:5173","https://zark-spice.netlify.app","https://frontend-checkout--zarkspice.netlify.app/"], 
//     methods:["GET","POST","PUT","DELETE"],
//     credentials:true,   
//     // allowedHeaders: ['Content-Type', 'Authorization'],
// }));



app.use('/api',loginRoute);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRoute)

// Multer Error
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ message: 'File size exceeds the limit, Upload an image of 1MB' });
        }
    } 
    else if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.') {
        res.status(400).json({ message: err.message });
    } 
else {
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
});


app.get('/',(req,res)=>{
    res.send('Welcome to Zark Masala')
})

app.get('/test/port',(req,res,next)=>{
    res.status(201).send(`Secure Connection with port ${port}`)
})

app.get('/test/database',(req,res)=>{
 const isConnected= mongoose.connection.readyState===1;
 if(isConnected){
     res.status(201).json({message :'MongoDB connection is active'})
 }
 else{
     res.status(500).json({message :'MongoDB connection is not active'})
 }
})

app.listen(port,()=>{
    console.log(`Connection with port ${port}`);
}) 