const mongoose = require('mongoose');
const product=require('../model/product.model')
const pagination = require('../utils/pagination')
const category=require('../model/category.model');
const {uploadOnCloudinary} = require('../utils/middleware/cloudinaryConfig');
const NodeCache=require('node-cache');
const nodeCache=new NodeCache()
// const datauri = require('datauri/parser.js');
// const path=require('path');
// const DataURIParser = new datauri();

const addProduct=async(req,res)=>{

    const {productName,productDescription,productExpiry,productMRP,productPrice,productQuantity,productCategory}=req.body;

    if(req.user.id !== req.params.AdminId || req.user.isAdmin===false)
    {
        return res.status(400).json('Unauthorized User. You are not allowed to ADD PRODUCT')
    }
    if(!productName || !productDescription || !productExpiry || !productMRP || !productPrice || !productQuantity  
        ||!productCategory || productName.trim() === "" || productDescription.trim() === "" || productExpiry.trim() === "" || productCategory.trim() === "" 
    )
    { 
        return res.status(400).send('All feilds are required');
    }
    try {
        const productNameExists=await product.findOne({
            productName:productName,
            productCategory:productCategory
        })

        if (productNameExists){
            return res.status(409).json({message:"Product with this name in this category already exists. Enter a new name"})
        } 
        else{
            let productPictureUrl=[]
            let link;
            let uploadResult;
                if (req.files && req.files.productPicture && req.files.productPicture.length > 0) { 
                    await Promise.all(
                        req.files.productPicture.map(async(file)=>{
                            uploadResult= await uploadOnCloudinary(file.path);
                            link=uploadResult.url;
                            productPictureUrl.push(link);
                }
            ))}
                else{
                    return res.status(404).json({message:"No file uploaded. Please upload some pictures"})
                }
                const final=new product({
                    productName,
                    productDescription, 
                    productExpiry,
                    productMRP,
                    productPrice,
                    productQuantity,
                    productCategory,
                    productPicture:productPictureUrl
                })
                
                const added=await final.save();
                res.status(201).json({message:'Product Added Succesfull',product:added});

                // nodeCache.del("productList");

                let existingCategory= await category.findOne({name:productCategory});
                if(!existingCategory)
                {
                    const newCategory=new category({
                        name:productCategory,
                        products:added,
                    });
                    await newCategory.save();
                }
                else{
                    existingCategory.products.push(final)
                    await existingCategory.save();
                }                  
        }
        } 
        catch (error) {
            return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
        }
}


const updateProduct=async(req,res)=>{
    if(req.user.id !== req.params.AdminId || req.user.isAdmin===false)
        {
            return res.status(400).json('Unauthorized User. You are not allowed to UPDATE PRODUCT')
        }
        else{
            const id=req.params.id;
            let Product;
             try {
      
                const idExist=await product.findById(id)
                if(!idExist)
                {
                    res.status(404).json({Message:'Product Not Found'})
                }
                else
                {
                    Product= await product.findByIdAndUpdate(
                        id,
                         {
                          $set:
                           {
                            productName:req.body.productName,
                            productDescription:req.body.productDescription, 
                            productExpiry:req.body.productExpiry,productMRP:req.body.productMRP,
                            productPrice:req.body.productPrice,
                            productQuantity:req.body.productQuantity,
                           }
                         },
                        {new: true}
                    );
                
                    const productSearch=await product.findById(id);
                    const categoryFound=productSearch.productCategory;
                
                    const categoryUpdate = await category.findOne({ name: categoryFound });
                
                    if (!categoryUpdate) {
                    return res.status(404).json({ message: "Category not found. Enter a valid Object ID." });
                    } else {
                
                    const productId = new mongoose.Types.ObjectId(id); // Extract ID for clarity
                
                        const updateFields = {
                        $set: {
                            "products.$[product].productName": req.body.productName,
                            "products.$[product].productDescription": req.body.productDescription,
                            "products.$[product].productExpiry": req.body.productExpiry,
                            "products.$[product].productPrice": req.body.productPrice,
                            "products.$[product].productQuantity": req.body.productQuantity
                        }
                    };
                
                    const options = {
                        arrayFilters: [{ "product._id": productId }],
                        new: true,
                        useFindAndModify: false
                    };
                
                    const response = await category.findByIdAndUpdate(categoryUpdate._id, updateFields, options);
                
                    if (response && Product) {
                        // nodeCache.del("productList");
                        return res.status(200).json({ message: "Product updated successfully"});
                    } else {
                        return res.status(500).json({ message: "Product not updated" });
                    }
                }
              }
        
            } catch (error) {
                console.log(error);
                return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
            }
        }

}


const deleteProduct=async(req,res)=>{
    
    if(req.user.id !== req.params.AdminId || req.user.isAdmin==false)
        {
            return res.status(400).json('Unauthorized User. You are not allowed to DELETE')
        }
    else{
        const id=req.params.id;
            try {
            
               const productSearch=await product.findById(id);
               if (!productSearch) {
                res.status(404).json({Message:'Product Not Found'})
               } else {
                const categoryFound=productSearch.productCategory;
     
                const categoryList=await category.findOne({name:categoryFound})
                   
                if(!categoryList){
                 res.status(404).json('No list found');
                }
                else{
                 const productToRemove=new mongoose.Types.ObjectId(id);
     
                 const updatedProducts = categoryList.products.filter(productId => 
                 productId._id.toString() !== productToRemove.toString())                 
     
                 categoryList.products = updatedProducts;       

                 await categoryList.save();
                }
     
               let Product= await product.deleteOne({"_id":id});
                if(!Product){
                 return res.status(500).json({message:"Product not found"})
                }else{
                 console.log({Product});
                    return res.status(201).json({message:"Product Removed"})
                }
               }
     
             } catch (error) {
                return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
             }
        }

}

const deleteCategory=async(req,res)=>{
    if(req.user.id !== req.params.AdminId || req.user.isAdmin==false)
        {
            return res.status(400).json('Unauthorized User. You are not allowed to DELETE Category')
        }
    else{
        const id=req.params.id;
            try {
               const categorySearch=await category.findById(id);
               if (!categorySearch) {
                res.status(404).json({Message:'Category Not Found'})
               } else {
                const categoryProduct=await categorySearch.products;
                await Promise.all(
                    categoryProduct.map(async (products) => {
                        await product.deleteOne({ _id: products._id });
                    })
                );        
                const final=await category.deleteOne({_id:id})
                if(final)
                    {
                        res.status(201).json({message:"Category and It's products both are Removed"})
                    }
                    else{
                        res.status(400).send({message:"Category Not removed. Some error might occur"});
                    }
               }
             } catch (error) {
                return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
             } 
        }
}

const categoryProduct=async(req,res)=>{
    let categoryList
    try{
         categoryList=await category.find();
    }  catch (error) {
        return console.log(error);
    }
    if(!categoryList){
        return res.status(404).send({message:"Nada"})
    }
    return res.status(200).send({categoryList});
}

const allProduct=async(req,res)=>{
    let productList;
    try{
        productList= await product.find()
        
        // if(nodeCache.has("productList"))
        // {
        //     productList=JSON.parse(nodeCache.get("productList"));
        // }
        // else
        // {
        //     productList=await product.find();
            
        //     nodeCache.set("productList",JSON.stringify(productList))       
        // }     
    }  catch (error) {
        return console.log(error);
    }
    if(!productList){
        return res.status(404).send({message:"No Products Found"})
    }
    return res.status(200).json({productList});
}

const searchProduct=async(req,res)=>{
    const keyword=req.query.search 
    ?
      {
        $or:[
            {productName: {$regex: req.query.search, $options:"i"}},
            {productCategory: {$regex: req.query.search, $options:"i"}},
        ]
      } 
      : 
       {
                 
    };

       try {
        const search=await product.find(keyword);
        res.status(201).json({search})        
       } catch (error) {
        return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
       }


}

const paginationProduct=async(req,res)=>{
    // let productList
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 10;
    const query={};
    try{
        let paginatedData= await pagination(product,query, page, limit);
        if(!paginatedData){
        return res.status(404).send({message:"Nothing found"})
    }
    return res.status(201).send({paginatedData});
    }  catch (error) {
        return res.status(500).json({error:{error_name:error.name,error_message:error.message}})
    }
}



module.exports={
    addProduct,
    categoryProduct,
    updateProduct,
    deleteProduct,
    deleteCategory,
    allProduct,
    paginationProduct,
    searchProduct,
}



        // // if(req.files && req.files.wareHouseImage && req.files.wareHouseImage.length > 0){
        // //     // return res.json(req.files.wareHouseImage);
        // //     await Promise.all(
        // //         req.files.wareHouseImage.map(async (file)=>{
        // //             // return console.log(file);
                    
        // //             uploadResult = await uploadOnCloudinary(file.path);
                    
        // //             console.log(uploadResult);
                    
        // //             link = uploadResult.url;
        // //             imageURL.push(link);
        // //         })
        // //     )
        // //  }else{
        // //     return next(ApiErrors(400,"No file uploaded. Please upload some pictures"));
        // //  }
        // // return res.json(req.file);

        // // if (req.file) {
        // //     // Iterate over each uploaded file
            
        // //             file=req.file;
                    
        // //             // return res.json(file);

        // //             const buffer = file.buffer;
                    
        // //             // return res.json(buffer);

        // //             const dataUriString = DataURIParser.format(path.extname(file.originalname).toString(), file.buffer);

        // //             // return res.json(dataUriString.content);

        // //             console.log('hello');

        // //             // uploadResult = await cloudinary.v2.uploader.upload_stream(dataUriString.content);
                    
        // //             cloudinary.uploader.upload(dataUriString.content,
        // //                 {
        // //                     upload_preset:'Testing',
        // //                     // public_id : `${file.originalname}Test`,
        // //                     allowed_formats:['png','jpg','jpeg','svg']
        // //                 },
        // //                 function(error,result){
        // //                     if(error){
        // //                         console.log(error);
        // //                     }
        // //                     console.log(result);   
        // //                 }
        // //             );
        // //             // .then(result => {
        // //             //     console.log(result);
        // //             //     return res.json(result);
        // //             // })
        // //             // .catch(err => {
        // //             //     console.log(err);
        // //             // })

        // //             // uploadOnCloudinary(dataUriString.content);
                                  
        // //             // console.log(uploadResult.secure_url);
                    
        // //             return res.json(uploadResult);

        // //             if (uploadResult && uploadResult.url) {
        // //               imageURL.push(uploadResult.url);
        // //             }

        // // } else {
        // //     return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
        // // }        

        // if (req.files && req.files.wareHouseImage && req.files.wareHouseImage.length > 0) {
        //     // Iterate over each uploaded file

        //     await Promise.all(
        //         req.files.wareHouseImage.map(async (file) => {

        //             // return res.json(file);

        //             // const buffer = file.buffer;

        //             const dataUriString = DataURIParser.format(path.extname(file.originalname).toString(), file.buffer);

        //             // return res.json(dataUriString);

        //             uploadResult = await uploadOnCloudinary(dataUriString.content);
                                  
        //             console.log(uploadResult);
                    
        //             return res.json(uploadResult);

        //             if (uploadResult && uploadResult.url) {
        //               imageURL.push(uploadResult.url);
        //             }

        //         })
        //     );
        // } else {
        //     return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
        // }        
