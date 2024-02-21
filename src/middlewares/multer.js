
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const bannerstorage = multer.diskStorage({
destination :function(req,file,cb) {
    cb(null,'public/uploadbanner');
},
filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
}
})


const upload =multer({storage:storage})
const uploadbanner =multer({storage :bannerstorage})





module.exports = {upload,uploadbanner};

