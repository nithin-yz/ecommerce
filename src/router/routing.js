const express = require("express");
const multer = require('multer')
const upload = require("../middlewares/multer")
const route = express.Router();

const {loginget} = require("../controllers/common/request")
const{signupget} =  require("../controllers/common/request")
const {userhomeget,signuppost,otpget,otppost,loginpost,menget} = require("../controllers/user/request")
const {adminget,addproductsget,addproductpost,userlistget,deleteuser} = require("../controllers/admin/request")
route.get(["/","/login"], loginget)
route.get("/signup", signupget)
route.get("/userhome", userhomeget)
route.post("/signup",signuppost)
 route.get(["/signup/otp/:id", "/signup/otp", "/signup/otp/resend/:id"], otpget)
route.post(["/signup/otp/:id",  ], otppost), 
route.post("/login",loginpost)
route.get("/userhome/men", menget)
route.get("/adminhome", adminget)
route.get("/adminhome/addproduct", addproductsget)
route.post("/adminhome/addproduct",upload.fields([{name:'image1'},{name:'image2'}, {name:'image3'}]),addproductpost)
route.get("/adminhome/userlist",userlistget)
route.post("/adminhome/deleteuser/:id", deleteuser)


module.exports =route