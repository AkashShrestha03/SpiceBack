const express=require('express');
const router=express.Router();
const verify=require('../utils/middleware/verifyToken')
const product=require('../controller/product.controller')
const upload=require('../utils/middleware/imageUploadMiddleware')

router.post('/addProducts/:AdminId',verify.verify,upload.fields([{name:"productPicture",maxCount:10}]),product.addProduct);
router.get('/category',product.categoryProduct);
router.get('/products',product.allProduct);
router.get('/paginateProducts',product.paginationProduct);
router.get('/searchProducts',product.searchProduct);
router.put('/update/:AdminId/:id',verify.verify,product.updateProduct);
router.delete('/deleteProduct/:AdminId/:id',verify.verify,product.deleteProduct);
router.delete('/deleteCategory/:AdminId/:id',verify.verify,product.deleteCategory);

module.exports=router;
