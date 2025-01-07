const express=require('express')
const router=express.Router();

const storeC=require("../controller/storeC");

router.get("/",storeC.getStore);
router.post("/post",storeC.postStore);
router.put('/update/:store_id', storeC.updateStore);
router.delete('/delete/:store_id', storeC.deleteStore);

module.exports=router;