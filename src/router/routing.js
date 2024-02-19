const express = require("express");
const multer = require('multer')
const upload = require("../middlewares/multer")
const route = express.Router();

const {loginget} = require("../controllers/common/request")
const{signupget} =  require("../controllers/common/request")
const {userhomeget,signuppost,otpget,otppost,loginpost,menget,womenget,profileget,cartget,profilepost} = require("../controllers/user/request")
const {adminget,addproductsget,addproductpost,userlistget,deleteuser,deleteproduct,showproductget,addressdeletepost,subcategoryload, } = require("../controllers/admin/request");
const { usershowproducts,addcategoryget, addcategorypost, addsubcategorypost,deletecategory,deletesubcategory,editaproductget,editaproductpost} = require("../controllers/products/request");
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
route.post("/adminhome/addproduct/categoryedit",subcategoryload)
route.post("/adminhome/addproduct",upload.fields([{name:'image1'},{name:'image2'}, {name:'image3'}]),addproductpost)
route.get("/adminhome/userlist",userlistget)
route.get("/userhome/account/:id", profileget)
route.post("/adminhome/deleteuser/:id", deleteuser)
route.get("/adminhome/deleteproduct/:id",deleteproduct)
route.get("/adminhome/showproduct", showproductget)
route.get("/adminhome/category", addcategoryget)
route.post("/adminhome/category", addcategorypost)
route.post("/adminhome/addsubcategory", addsubcategorypost)
route.get("/userhome/usershowproduct/:id", usershowproducts)
route.get("/userhome/cart/:id", cartget)
route.post("/userhome/account/:id",profilepost)
route.post("/delete/address", addressdeletepost)
route.post("/delete/category",deletecategory)
route.post("/delete/subcategory",deletesubcategory)
route.get("/adminhome/edit/", editaproductget)
route.post("/adminhome/edit/" ,upload.fields([{name:'image1'},{name:'image2'}, {name:'image3'}]),editaproductpost)














module.exports =route