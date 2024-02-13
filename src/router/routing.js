const express = require("express");
const multer = require('multer')
const upload = require("../middlewares/multer")
const route = express.Router();

const {loginget} = require("../controllers/common/request")
const{signupget} =  require("../controllers/common/request")
const {userhomeget,signuppost,otpget,otppost,loginpost,menget,womenget,profileget} = require("../controllers/user/request")
const {adminget,addproductsget,addproductpost,userlistget,deleteuser,deleteproduct,showproductget} = require("../controllers/admin/request");
const { usershowproducts } = require("../controllers/products/request");
route.get(["/","/login"], loginget)
route.get("/signup", signupget)
route.get("/userhome", userhomeget)
route.post("/signup",signuppost)
 route.get(["/signup/otp/:id", "/signup/otp", "/signup/otp/resend/:id"], otpget)
route.post(["/signup/otp/:id",  ], otppost), 
route.post("/login",loginpost)
route.get("/userhome/men", menget)
route.get("/userhome/women" ,womenget)
route.get("/adminhome", adminget)
route.get("/adminhome/addproduct", addproductsget)
route.post("/adminhome/addproduct",upload.fields([{name:'image1'},{name:'image2'}, {name:'image3'}]),addproductpost)
route.get("/adminhome/userlist",userlistget)
route.get("/userhome/account", profileget)
route.post("/adminhome/deleteuser/:id", deleteuser)
route.post("/adminhome/deleteproduct/:id",deleteproduct)
route.get("/adminhome/showproduct", showproductget)
route.get("/userhome/usershowproduct/:id", usershowproducts)


module.exports =route