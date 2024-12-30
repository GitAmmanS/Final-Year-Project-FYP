const multer = require("multer");
const path =require("path");
const crypto = require('crypto');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
       cb(null,'./public')
    },
    filename: function(req, file, cb) {
        crypto.randomBytes(12,function(err,name){
            const fn = name.toString("hex")+path.extname(file.originalname);
            cb(null,fn)
        })
    }
});



module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 
    }
});