const multer = require("multer");
const path =require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, path.join(__dirname, '../public'));
        }else {
            cb(new Error('Unsupported file type'));
        }
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname.replace(/\s/g, '');
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    if ((file.fieldname === "picture" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'))){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage: storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 
    }
});