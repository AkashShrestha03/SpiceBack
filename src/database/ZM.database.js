const mongoose=require('mongoose');
require('dotenv').config();

// const uri=process.env.URI;

mongoose.connect('mongodb+srv://zarkmasala:1Zark2Masala3@cluster0.4rebmpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('Connection Successful with MongoDB');
})
.catch((error)=>{
    console.log(`No Connection with MongoDB. Error:${error}`);
})