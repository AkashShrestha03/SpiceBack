const cloudinary = require('cloudinary').v2;
// require('dotenv').config();
const fs=require('fs');
cloudinary.config({
    cloud_name: "douuxmaix", 
    api_key: "343419412862917", 
    api_secret: "K9ajO5vo3tupeZWoitwNCi_Kq7U" 
});
    
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) 
        {
            // return null
            console.log("no file path");
        }
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // console.log("File is uploaded on Cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

module.exports={
    uploadOnCloudinary
}

// const cloudinary=require('cloudinary').v2;
// const ApiErrors=require('../../utils/ApiResponse/ApiErrors')

// const fs=require('fs');

// cloudinary.config({
//     cloud_name:"dm6yqgvm4",
//     api_key:"322962655323385",
//     api_secret:"_16mqdQ4KPjQ7gd4BMl4Ytrxx0c",
//     // log_level: "debug" 
// });

// const uploadOnCloudinary= async (localFilePath,next) => {
    // try{
    //     if(!localFilePath)
    //     {
    //         console.log("No file path Provided");
    //         return null;
    //     }
    //     console.log("Uploading file:", localFilePath);
        
    //     return new Promise((resolve, reject) => {
    //         const response= cloudinary.uploader.upload(localFilePath,{
    //             resource_type:"auto",
    //             timeout: 60000
    //         },(error, result) => {
    //                             if (error) {
    //                                 console.error("Upload error:", error); // Log only the message
    //                                 return reject(new Error(`Upload failed,${error.message}`));
    //                             }
    //                             resolve(result);
    //         });
    //         fs.unlinkSync(localFilePath)
    //         return response;
    //     })
    // }catch (error){
    //     console.error("Upload error:", error);
    //     if (fs.existsSync(localFilePath)) {
    //         fs.unlinkSync(localFilePath); // Ensure file is deleted on error
    //     }
    //     return null;
    // }

//     try{
//         if(!localFilePath)
//         {
//             console.log("No file path Provided");
//             return null;
//         }
//         console.log("Uploading file:", localFilePath);
//         const response= await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto",
//             timeout: 60000
//         })
//         fs.unlinkSync(localFilePath)
//         return response;
//     }catch (error){
//         console.error("Upload error:", error);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath); // Ensure file is deleted on error
//         }
//         return null;
//     }
// }

// const uploadOnCloudinary = async (buffer) => {
//     try {
//         if (!buffer) {
//             console.log("No buffer provided");
//             return null;
//         }
//         return new Promise((resolve, reject) => {
//             const uploadStream = cloudinary.uploader.upload_stream({
//                 resource_type: "auto",
//                 timeout: 120000
//             }, (error, result) => {
//                 if (error) {
//                     console.error("Upload error:", error); // Log only the message
//                     return reject(new Error(`Upload failed,${error.message}`));
//                 }
//                 resolve(result);
//             });
//             uploadStream.end(buffer);
//         });
//     } catch (error) {
//         console.error("Upload error:", error);
//         return null;
//     }
// };


// module.exports={
//     uploadOnCloudinary
// }


// const uploadOnCloudinary= async (localFilePath,next) => {
//     try{
//         if(!localFilePath)
//         {
//             console.log("No file path Provided");
//             return null;
//         }
//         console.log("Uploading file:", localFilePath);
//         const response= await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto",
//             timeout: 60000
//         })
//         fs.unlinkSync(localFilePath)
//         return response;
//     }catch (error){
//         console.error("Upload error:", error);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath); // Ensure file is deleted on error
//         }
//         return null;
//     }
// }

