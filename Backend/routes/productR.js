const express=require('express')
const router=express.Router();

const productC=require("../controller/productC");
const productPic=require("../middleware/productPic");

router.get("/",productC.getProducts);
router.get("/searchbyname/:name",productC.getProductsByName);
router.get("/searchbyid/:_id", productC.getProductsById);
router.post("/post",productPic.single("picture"),productC.postProduct);
router.put('/update/:product_id', productPic.single('picture'), productC.productUpdate);
router.put('/update/:product_id', productPic.single('picture'), productC.productUpdate);
router.delete('/delete/:product_id', productPic.single('picture'), productC.deleteProduct);

module.exports=router;