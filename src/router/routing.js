const express = require("express");
const multer = require("multer");
const { upload, uploadbanner } = require("../middlewares/multer");
const route = express.Router();

const { loginget } = require("../controllers/common/request");
const { signupget } = require("../controllers/common/request");
const {
  userhomeget,
  signuppost,
  otpget,
  otppost,
  loginpost,
  allproductget,
  womenget,
  profileget,
  cartget,
  profilepost,
  wishlistget,
  wishlistaddpost,
  logoutget,
  wishlistremoval,
  cartgetlag,
  addcartget,
  cartremovalget,
  updatecartquantity,
  searchandget,
  checkoutget,
  couponcodeapply,
  placeorderpost,
  emailverifyget,
  emailverifypost,
  userordersget,
  razorpayget,
  razorpaypost,
  cancelorderpost,
  ordergetdetails,
  forgotpasswordget,
  forgotpasswordpost,
  forgotpasswordotppost,
  updatepasswordpost,
} = require("../controllers/user/request");

const {
    adminlogoutget,
  adminget,
  addproductsget,
  addproductpost,
  userlistget,
  deleteuser,
  deleteproduct,
  showproductget,
  addressdeletepost,
  subcategoryload,
  addbannerget,
  addbannerpost,
  deletebannerget,
  bannerupdatepost,
  updateorderstatus,
  userordersfullget,
  signupdataget,
  productgraphget,
  updateuserstatuspost,
  submitreviewpost,
} = require("../controllers/admin/request");
const {
  usershowproducts,
  addcategoryget,
  addcategorypost,
  addsubcategorypost,
  deletecategory,
  deletesubcategory,
  editaproductget,
  editaproductpost,
  addcouponget,
  addcouponpost,
  updatecoupon,
  deletecoupon,
} = require("../controllers/products/request");
route.get(["/", "/login"], loginget);
route.get("/signup", signupget);
route.get("/userhome", userhomeget);
route.post("/signup", signuppost);
route.get("/signup/otp/:id", otpget);
route.post(["/signup/otp/:id"], otppost), 
route.post("/login", loginpost);
route.get("/userhome/men", allproductget);
route.get("/userhome/women", womenget);

route.post("/userhome/account/:id", profilepost);
route.post("/delete/address", addressdeletepost);
route.post("/delete/category", deletecategory);
route.post("/delete/subcategory", deletesubcategory);

route.get("/userhome/account/:id", profileget);
route.get("/userhome/usershowproduct/:id", usershowproducts);
route.get("/userhome/cart/", cartget);
route.get("/userhome/wishlist", wishlistget);
route.post("/userhome/wishlist/add/:productid", wishlistaddpost);
route.get("/userhome/wishlist/remove/:productid", wishlistremoval);

route.get("/userhome/logout", logoutget);
route.get("/userhome/account", cartgetlag);
route.get("/userhome/cart/add/:id", addcartget);
route.get("/userhome/removecartitem/:cartid", cartremovalget);
route.post("/userhome/cart/update/quantity", updatecartquantity);
route.get("/userhome/search/", searchandget);
route.get("/userhome/checkout", checkoutget);
route.get("/checkout/applycoupon", couponcodeapply);
route.post("/checkout/placeorder", placeorderpost);
route.get("/user/emailverify", emailverifyget);
route.post("/user/emailverify", emailverifypost);
route.get("/userhome/orders", userordersget);
route.get("/payment/razorpay", razorpayget);
route.post("/payment/razorpay", razorpaypost);
route.post("/user/cancelorder", cancelorderpost);
route.get("/user/order", ordergetdetails);

route.get("/user/forgotpassword", forgotpasswordget);
route.post("/user/forgotpassword", forgotpasswordpost);
route.post("/user/forgotpassword/otp", forgotpasswordotppost);
route.post("/user/forgotpassword/update", updatepasswordpost);
route.post("/user/submitreview", submitreviewpost);

const isAdmin = (req, res, next) => {
    console.log("worked")
  if (req.session.admin === true) {
    next();
  } else {
    res.redirect("/login");
  }
};

//adminside
route.get("/adminhome", isAdmin, adminget);
route.get("/adminhome/addproduct", isAdmin, addproductsget);
route.post("/adminhome/addproduct/categoryedit", isAdmin, subcategoryload);
route.post(
  "/adminhome/addproduct",
  isAdmin,
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  addproductpost
);
route.get("/adminhome/userlist", isAdmin, userlistget);

route.post("/adminhome/deleteuser/:id", isAdmin, deleteuser);
route.get("/adminhome/deleteproduct/:id", isAdmin, deleteproduct);
route.get("/adminhome/showproduct", isAdmin, showproductget);
route.get("/adminhome/category", isAdmin, addcategoryget);
route.post("/adminhome/category", isAdmin, addcategorypost);
route.post("/adminhome/addsubcategory", isAdmin, addsubcategorypost);
route.get("/admin/users/signupdata", isAdmin, signupdataget);
route.get("/admin/users/productdata", isAdmin, productgraphget);
route.post("/admin/updateuserstatus", isAdmin, updateuserstatuspost);

route.get("/adminhome/edit/", isAdmin, editaproductget);
route.post(
  "/adminhome/edit/",
  isAdmin,
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  editaproductpost
);
route.get("/adminhome/addbanner", addbannerget);

route.post(
  "/adminhome/addbanner",
  isAdmin,
  uploadbanner.single("bannerimage"),
  addbannerpost
);
route.get("/adminhome/deletebanner/", isAdmin, deletebannerget);
route.post(
  "/adminhome/updatebanner",
  isAdmin,
  uploadbanner.single("imagefile"),
  bannerupdatepost
);
route.get("/adminhome/addcoupon", isAdmin, addcouponget);
route.post("/adminhome/addcoupon", isAdmin, addcouponpost);
route.post("/adminhome/updatecoupon/:id", isAdmin, updatecoupon);
route.delete("/adminhome/deletecoupon", isAdmin, deletecoupon);
route.get("/adminhome/orders", isAdmin, userordersfullget);
route.post("/admin/update/orderstatus", isAdmin, updateorderstatus);
route.get("/admin/logout", isAdmin, adminlogoutget);

module.exports = route;
