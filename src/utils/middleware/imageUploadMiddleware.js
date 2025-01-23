const multer = require('multer');

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'), false);
    }
};

const upload= multer({
    storage:storage,
    limits: {
        fileSize:1024 * 1024 * 1
    },
    fileFilter:fileFilter
}) 

module.exports= upload
