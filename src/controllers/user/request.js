const bcrypt = require("bcrypt");
const { user, product, userprofile,banner,wishlist,cart,coupon,Order,review} = require("../../models/databaseschema");
const serviceID = "VAc66fc21c45c044d1ab1ccdfac90eab3c";
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51OrheASGiZWYvo9CNSo8xkhnXoNOzVtFdgLCqeqOnlBIU61C8wiAd7fCJWUoAv53D79oxWcaCtNixlYafFPsTtjD00fYKUxytn');
const publishkey ='pk_test_51OrheASGiZWYvo9CambCngbBzQKXXOJ2PysL8Y499qnWqFEhSNjNdPafQJ3rG8Zq01muBD8iSWu0crCwVGfGIwlr00ZlzDU1ro'
const secretkey= 'sk_test_51OrheASGiZWYvo9CNSo8xkhnXoNOzVtFdgLCqeqOnlBIU61C8wiAd7fCJWUoAv53D79oxWcaCtNixlYafFPsTtjD00fYKUxytn'
// const serviceID ="MG97f0b3d1d7e90d4569dfcea3323b08dc"
const accountID = "AC27dfaf6dc082030c3200209807da96fc";
const authToken = "342ec8950109dbcc43494e64689f300f";
const client = require("twilio")(accountID, authToken);
const mongoose = require("mongoose");
const flash= require("connect-flash");
const { SigningKeyContextImpl } = require("twilio/lib/rest/api/v2010/account/signingKey");


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
}




exports.userhomeget = async (req, res) => {
  try {
      const p = await product.find().sort({ createdAt: -1 }).limit(8)
      const banner1 = await banner.find();
      const user = req.session.user;
      const userId = user ? user._id : null; 
      const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
     
      const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;
      
      res.render("user/userhome1", {
          products: p,
          user1: user,
          banner1: banner1,
          userwishlist: userwishlist ? userwishlist.products : [],
          Emptywishlist: Emptywishlist
      });
  } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred while rendering the userhome page.");
  }}



  
  exports.wishlistremoval = async (req, res) => {
      try {
    
          if (req.session.email) {
              const productId = req.params.productid;
  
              // Find the user by email
              const finder = await user.findOne({ email: req.session.email });
  
              if (finder) {
                  const userId = finder._id;
  const userwishlist = await wishlist.findOne({user:userId})


  if (userwishlist) {

    const updatedProductsArray = userwishlist.products.filter(prodId => prodId.toString() !== productId); // Ensure matching using string representation

   
    userwishlist.products = updatedProductsArray;
    await userwishlist.save()

    return res.sendStatus(200)
  }else{

    return res.sendStatus(400)

  }






 


                  
              } else {
                  return res.sendStatus(404)
              }
          } else {
              return res.status(403)
          }
      } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
      }
  };
  
exports.loginpost = async (req, res) => {
  try {
      const { email, password } = req.body;
      const findperson = await user.findOne({ email: email });

      if (findperson) {
          const check = await bcrypt.compare(password, findperson.password);

          if (check) {
             

              if (findperson.verified) {
                  // const userwishlist = await wishlist.findOne({ user: findperson._id });
                  

if(findperson.status=="active"&& findperson.role=="user"){
  req.session.email = email;
  req.session.user = findperson;

 return res.status(200).redirect('/userhome');

}else if(findperson.status=="active"&& findperson.role=="admin"){

req.session.admin=true
  return res.status(200).redirect('/adminhome');


}






else{
  req.flash('error1', "you are temporarly blocked");
  return res.redirect("/login");


}


                  // req.session.userwishlist = userwishlist ? userwishlist.products : [];
                  
              } else {
                  const cell = findperson.phone;
                  return res.status(200).redirect(`/signup/otp/${cell}`);
              }
          } else {
              req.flash('error1', "Incorrect login details");
              return res.redirect("/login");
          }
      } else {
          req.flash('error1', "User doesn't exist, please sign up");
          return res.redirect("/login");
      }
  } catch (err) {
      console.log(err);
      req.flash('error1', "An error occurred during login");
      return res.redirect("/login");
  }
};


exports.wishlistget = async(req,res)=>{
if (req.session.email) {
  const userid =req.session.user._id
const wishlists = await wishlist.findOne({user:userid}).populate('products')

res.render("user/wishlist", { wishlist: wishlists ? wishlists.products : [] });
// res.render("user/wishlist",{wishlist:wishlists})

}else{

res.redirect("/login")

}



}









exports.signuppost = async (req, res) => {
  try {
    const { username, email, phone, password, confirmpassword } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneregex = /^\d{10}$/;
    const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=]{8,}$/;

    if (emailRegex.test(email)) {
      const finder = await user.findOne({ email: email });
      if (!finder) {
        if (phoneregex.test(phone)) {
          if (passwordregex.test(password)) {
            console.log(password,confirmpassword)
            if (password == confirmpassword) {
        
              const encrypt = await bcrypt.hash(password, 10);
              const newuser = new user({
                username,
                email,
                phone,
                password: encrypt,
              });
              const p = await newuser.save();
              if (p) {
                return res.redirect(`/signup/otp/${email}`);
              }
            } else {
              req.flash('error', 'Confirm password does not match');
              return res.redirect("/signup");
            }
          } else {
            req.flash('error', 'Please enter a valid password (at least 8 characters, including one letter and one digit)');
            return res.redirect("/signup");
          }
        } else {
          req.flash('error', 'Please enter a valid phone number');
          return res.redirect("/signup");
        }
      } else {
        req.flash('error', 'Email already exists. Please sign in.');
        return res.redirect("/signup");
      }
    } else {
      req.flash('error', 'Please enter a valid email');
      return res.redirect("/signup");
    }
  } catch (err) {
    console.log(err);
    req.flash('error', 'You are not signed yet');
    res.redirect("/signup");
  }
}


exports.otpget = async (req, res) => {
  try {
    const email = req.params.id;

    const otp = generateOTP();
    console.log(otp)
            // Store OTP in session (you might want to use a more secure storage)
            req.session.otp = otp;
            req.session.email=email
    
            // Create a Nodemailer transporter
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "tomshift22@gmail.com",
                    pass: 'fblj qvtl mnsj yodt '
                }
            });
    
            // Set up email data
            let mailOptions = {
                from: 'tomshift22@gmail.com',
                to: email,
                subject: 'Email Verification OTP',
                text: `Your OTP for email verification is: ${otp}`
            };
    
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.send('Error sending email.');
                } else {
                    console.log("hlo")
                    res.render("user/otp",{message:email,error:req.flash("error")})
                }
            });
   



    // console.log(phone)
  
  } catch (err)
  {

console.log(err)

  }
};

exports.otppost = async (req, res) => {
 
  const { otp } = req.body;
  const sendotp =req.session.otp
  const email = req.session.email
  try {
    

  

    if (otp==sendotp) {
      let changing = await user.findOne({ email: email })
      await user.updateOne({email},{$set:{
        verified:true}})
                
        
        delete req.session.email
        delete req.session.otp
      res.redirect("/login");
    } else {
     
      req.flash("error", "otp is incorrect");
      res.redirect(`/signup/otp/${email}`);
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "number is not registered with twilio");
    res.redirect(`/signup/otp/${email}`);
  }
};

  exports.allproductget = async (req, res) => {
    try {
      const query = req.query.query;
      
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;

      // Constructing the query object
      let queryObj = {};

      // Adding price range filters if provided
      if (minPrice && maxPrice) {
        queryObj.newPrice = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice) {
        queryObj.newPrice = { $gte: minPrice };
      } else if (maxPrice) {
        queryObj.newPrice = { $lte: maxPrice };
      }


      
      
      // If query is provided, add it to the search
      if (query) {
        const regex = new RegExp(query, 'i');
       
        if (query.toLowerCase() === 'men') {
          queryObj.category = 'MEN'; // Ensure only products with category 'MEN' are included
        } else if (query.toLowerCase() !== 'allproducts') {
          queryObj.$or = [
            { productname: regex },
            { description: regex },
            { category: regex }
          ];
        }
        // If the query is 'allproducts', don't add any additional filter
      }


      const page = parseInt(req.query.page) || 1;
      const limit = 8;

      let  skip

      if(page==1){


  skip=0

      }else{

    skip = (page - 1) * limit;

      }
      
      
      
      
      
  

      const productsCount =await product.find(queryObj).countDocuments();
     
      const totalPages = Math.ceil(productsCount / limit);
   


  const p = await product.find({category:'MEN'}).skip(skip).limit(limit)

      const currentURL = req.originalUrl?req.originalUrl:"";
   
      const banner1 = await banner.find();
      const user = req.session.user;
      
      const userId = user ? user._id : null;
      const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
      const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;

      res.render("user/allproducts", {
        products: p,
        user1: user,
        banner1: banner1,
        userwishlist: userwishlist ? userwishlist.products : [],
        Emptywishlist: Emptywishlist,
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
        currentURL
      });
    } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while rendering the all products page.");
  }
}



exports.womenget =async (req,res)=>{
  try {
    const query = req.query.query;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    // Constructing the query object
    let queryObj = {};

    // Adding price range filters if provided
    if (minPrice && maxPrice) {
      queryObj.newPrice = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      queryObj.newPrice = { $gte: minPrice };
    } else if (maxPrice) {
      queryObj.newPrice = { $lte: maxPrice };
    }

    // If query is provided, add it to the search
    if (query) {
      const regex = new RegExp(query, 'i');
      queryObj.$or = [
        { productname: regex },
        { description: regex },
        { category: regex }
      ];
    }

    
    const banner1 = await banner.find();
    const user = req.session.user;
    const userId = user ? user._id : null;
    const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
    const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;


    let  skip
    if(page==1){
  
      skip=0
      
    }else{
      
      skip = (page - 1) * limit;
      
    }
    
    
    const productsCount =await product.find(queryObj).countDocuments();
    
    const totalPages = Math.ceil(productsCount / limit);
    
    
    const currentURL = req.originalUrl?req.originalUrl:"";
    
    
    
    const p = await product.find(queryObj).skip(skip).limit(limit)
   


    res.render("user/allproducts", {
      products: p,
      user1: user,
      banner1: banner1,
      userwishlist: userwishlist ? userwishlist.products : [],
      Emptywishlist: Emptywishlist,currentPage: page,
      itemsPerPage: limit,
      totalPages,
      currentURL

    });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while rendering the all products page.");
  }
}

exports.profileget = async(req,res)=>{

const id =  req.params.id
const person = await user.findById(id)
const userid = new mongoose.Types.ObjectId(id)
const address1 = await user.aggregate([
  {$match:{_id:userid}},
  {$lookup:{from:'userprofile', localField:"_id",foreignField:"ref", as:"address"}}])
// console.log(address1[0].address)
const address = address1[0].address
res.render("user/profile",{person, address, person1:"",alert:""})



}

exports.cartget = async(req,res)=>{

if(req.session.email) {

const finder = await user.findOne({email:req.session.email})
if(finder){

const id = finder._id
const usercart = await cart.findOne({ userref: id }).populate('items.product')





return res.render("user/cart", { cart: usercart })

}





}else{

res.redirect("/login")

}
}


exports.profilepost = async(req,res)=>{
try{
  const id = req.params.id
const {address,pin,locality,landmark} = req.body
const obid = new mongoose.Types.ObjectId(id)


collection = await userprofile.find({ref:id})

if (!(collection.length>=3)){


const profile = new userprofile ({

  address,
  pin,
  locality,
  landmark,
  ref:obid

})



await profile.save()


const findarray =await userprofile.find({ref:id})


res.redirect(`/userhome/account/${id}`)
}else{

// alert("you already have 3 addresses in your list")
res.redirect(`/userhome/account/${id}?alert=exceeded the limit of adding address`)

}    }





catch(error){

// console.log(error)



}
}

exports.wishlistaddpost=async(req,res)=>{

if(req.session.email) {

  const email=req.session.email
 const productid1 = req.params.productid



const user1 = await user.findOne({email:email})


const user1id = user1._id

const userwishlist = await wishlist.findOne({user:user1id})
if (userwishlist){


const loopingarray= userwishlist.products
const index = loopingarray.indexOf(productid1)


if(index !== -1){
  loopingarray.splice(index, 1)           

await userwishlist.save()
return res.sendStatus(204)
}else{

loopingarray.push(productid1)

await userwishlist.save()

return res.sendStatus(204)
}

}else {

const newish = new wishlist({

  user:user1id,
  products:[productid1]


})

await newish.save()
res.sendStatus(204)
}












}
else{

  res.sendStatus(400)
}






}

exports.logoutget = async(req,res)=>{

if(req.session.email){


req.session.destroy(err=>{

console.log(err)

})
res.redirect("/userhome")

}else{

res.redirect("/userhome")

}




}

exports.cartgetlag =async(req,res)=>{

if(req.session.email){

const finder = await user.findOne({email:req.session.email})
const id = finder._id

res.redirect(`/userhome/account/${id}`)

}else{

  res.redirect("/login")
}


}

exports.addcartget = async (req, res) => {
  try {
      if (req.session.email) {
          const id = req.params.id;
          
          const finder = await user.findOne({ email: req.session.email });
        
          const userId = finder._id;
          
          const findProduct = await product.findById(id);
         
          const alreadyExistCart = await cart.findOne({ userref: userId });
console.log(alreadyExistCart)
          if (!alreadyExistCart) {
              const usersCart = new cart({
                  userref: userId,
                  items: [{ product: findProduct._id, quantity: 1, price: findProduct.newprice }],
                  totalquantity: 1,
                  totalprice: findProduct.newprice
              });

              await usersCart.save();
              return res.sendStatus(200);
          } else {
              const alreadyProduct = alreadyExistCart.items.find(item =>{ 
                
            
               return item.product.toString()==id
              
              
              });

              if (alreadyProduct) {
                  alreadyProduct.quantity += 1;
              } else {
                  alreadyExistCart.items.push({ product: findProduct._id, quantity: 1, price: findProduct.newprice });
              }

              alreadyExistCart.totalquantity += 1;
              alreadyExistCart.totalprice += findProduct.newprice;

              await alreadyExistCart.save();
              return res.sendStatus(200);
          }
      } else {
          return res.sendStatus(400);
      }
  } catch (err) {
      console.error(err);
      return res.sendStatus(500);
  }
};

exports.
cartremovalget = async(req,res)=>{
try{
  if(req.session.email){
  const userfinder = await user.findOne({email:req.session.email})
  const userid = userfinder._id

  const cartid =req.params.cartid

const usercart = await cart.findOne({userref:userid})

if(usercart){

const updatedarray =usercart.items.filter((a)=>{

return a._id.toString()!==cartid
}
)


usercart.items = updatedarray
let newTotalQuantity = 0;
let newTotalPrice = 0;
updatedarray.forEach((item) => {
    newTotalQuantity += item.quantity;
    newTotalPrice += item.price * item.quantity;
});

// Update cart with new values
usercart.items = updatedarray;
usercart.totalquantity = newTotalQuantity;
usercart.totalprice = newTotalPrice;

// Save the updated cart
await usercart.save();

return res.sendStatus(200);









}




  }else{

res.sendStatus(400)

  }

}catch (err){

console.log(err)

}
}




exports.updatecartquantity =async(req,res)=>{

  try {
    if (req.session.email) {
        const finder = await user.findOne({ email: req.session.email });
        const userid = finder._id;
        const productid = req.body.index;
        const quant = req.body.quantity;

        const usercart = await cart.findOne({ userref: userid });

        const cartItemIndex = usercart.items.findIndex(ele => ele._id == productid);

        if (cartItemIndex !== -1) {
            // Update quantity
            usercart.items[cartItemIndex].quantity = quant;

            // Calculate total quantity and total price
            let totalquantity1 = 0;
            let totalprice1 = 0;

            for (const ele of usercart.items) {
                const productfinder = await product.findOne({ _id: ele.product });
                const productprice = productfinder.newprice;

                ele.price = productprice;

                totalquantity1 += ele.quantity;
                totalprice1 += ele.price * ele.quantity;
            }

            usercart.totalquantity = totalquantity1;
            usercart.totalprice = totalprice1;

            // Save changes
            await usercart.save();

        res.sendStatus(200)
        } else {
          res.sendStatus(400)
            console.log('Product not found in user cart.');
        }
    }
} catch (err) {
    console.log(err);
}

}










exports.searchandget = async (req, res) => {
  try {
    const query = req.query.query;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    let queryObj = {};

    if (minPrice && maxPrice) {
      queryObj.newprice = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      queryObj.newprice = { $gte: minPrice };
    } else if (maxPrice) {
      queryObj.newprice = { $lte: maxPrice };
    }

    if (query && query.toLowerCase() !== 'allproducts') {
      queryObj.$or = [
        { productname: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { category: { $regex: new RegExp('^' + query.toLowerCase(), 'i') } } // Force search term to lowercase before matching
      ];
    }

    // If the query is 'allproducts', don't add any additional filter
    if (query && query.toLowerCase() === 'allproducts') {
      queryObj = {};
    }


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const productsCount =await product.find(queryObj).countDocuments();
    
    const totalPages = Math.ceil(productsCount / limit);
  
    // const products = await Product.find().skip(skip).limit(limit);









    const p = await product.find(queryObj).skip(skip).limit(limit)

    const banner1 = await banner.find();
    const user = req.session.user;
    const userId = user ? user._id : null;
    const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
    const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;

    res.render("user/allproducts", {
      products: p,
      user1: user,
      banner1: banner1,
      userwishlist: userwishlist ? userwishlist.products : [],
      Emptywishlist: Emptywishlist,
      currentPage: page,
      itemsPerPage: limit,
      totalPages,
      currentURL:""




    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching and rendering products.");
  }
};











exports.checkoutget =async(req,res)=>{

try{
if(req.session.email) {
const finder = await user.findOne({email:req.session.email})
const id = finder._id
// console.log(id)
const addresses = await userprofile.find({ref:id})

const usercart = await cart.findOne({ userref: id }).populate('items.product')
const coupons = await coupon.find()
// console.log(coupons)
  res.render("user/checkout", {cart:usercart,addresses,userid:id,coupons})
}else{

  res.redirect("/login")
}

}catch(error){


console.log(error)


}

}

exports.couponcodeapply =async(req,res)=>{


if(req.session.email){
const finder = await user.findOne({email:req.session.email})  

const usercart = await cart.findOne({userref:finder._id})


const Code  =req.query.code

const coupons = await coupon.find()

const checker = coupons.find( (ele)=>{

return ele.code ==Code


}
  
  
  
  )

 
if(checker){

const discount = checker.offerprice
const amountcheck= checker.priceabove



if(usercart.totalprice > amountcheck ) {
  
  usercart.totalprice = usercart.totalprice -discount

  usercart.save()

  res.status(200).json({discount})


}else{

  res.status(400).json({ invalidcoupon: "not applicable" })

}



}else{

  res.status(400).json({ invalidcoupon: "invalidcoupon" });


}



}



}


exports.placeorderpost= async (req, res) => {
  try {

    if (req.session.email) {
    // console.log(req.body)
    const {address,paymentMethod} =req.body
    // const { userId, products, address, paymentMethod } = req.body;

    const finder = await user.findOne({email:req.session.email})
    const userid =finder._id
    const usercart = await cart.findOne({userref:userid})
    const productsarray = usercart.items
const totalamount =usercart.totalprice

    // console.log(usercart)


  
    const newOrder = new Order({
      user: userid, // Reference to the user who placed the order
      
      products: productsarray,
      address: address,
      paymentMethod: paymentMethod,
      totalamount
    })


req.session.order = newOrder


return res.status(200).json(paymentMethod)

  }
  else{
return res.redirect("/login")

  }
    // Save the order to the database
    // await newOrder.save();

    // Return success response
    // return res.status(200).json({ success: true, message: 'Order placed successfully!', orderId: orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order. Please try again later.' });
  }
};



exports.emailverifyget = async (req, res) => {
    if (req.session.email) {
        const email = req.session.email;
        
        // Generate OTP
        const otp = generateOTP();
console.log(otp)
        // Store OTP in session (you might want to use a more secure storage)
        req.session.otp = otp;

        // Create a Nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "tomshift22@gmail.com",
                pass: 'fblj qvtl mnsj yodt '
            }
        });

        // Set up email data
        let mailOptions = {
            from: 'tomshift22@gmail.com',
            to: email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is: ${otp}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.send('Error sending email.');
            } else {
                // console.log('Email sent: ' + info.response);
                res.render("user/verifyemail", { email: email });
            }
        });
    } else {
        res.redirect('/login');
    }
};


exports.emailverifypost =async(req,res)=>{


try{

  if(req.session.email){
  const { email, otp } = req.body;

 
  const storedOTP = req.session.otp; 


  if (Number(otp) === storedOTP) {
     
      delete req.session.otp;

      const orders= req.session.order

// console.log(orders)
const neworder = new Order (orders)
const userid =  await user.findOne({email:req.session.email})
// console.log(userid)
const usercart = await cart.findOne({ userref:userid._id});
if (usercart){  

  await cart.deleteOne({ userref: userid._id })

}

await   neworder.save()
delete req.session.order
      res.json({ success: true });



  } else {
      
      res.json({ success: false });
  }
}else{

res.redirect("/login")

}
}

catch(error){

console.log(error)

}


}

exports.userordersget = async(req,res)=>{

try{
if(req.session.email){
const user1 = await user.findOne({email:req.session.email})

const order = await Order.find({ user: user1._id }).populate('products.product');
// console.log(order[0].products)
res.render("user/orders",{user1:user1?user1 :null,order:order?order:null})

}else{

res.redirect("/login")

}
}
catch(error){

console.log(error)


}






}

const YOUR_DOMAIN = "http://127.0.0.1:8580"
exports.razorpayget =async(req,res)=>{
  
  if (req.session.email&&req.session.order){
const amount = req.session.order.totalamount

  res.render("user/stripepayment" ,{key:publishkey,amount})
}
else{
  res.redirect("/login")
}
}






exports.razorpaypost = async (req, res) => {

  try {
    
    stripe.customers.create({
      email:req.body.stripeEmail,
      source:req.body.stripeToken,
      name: 'Gautam Sharma',
      address : {
      line1: '23 Mountain Valley New Delhi',
      postal_code: '110092',
      city: 'New Del',
      state: 'washington',
      country: 'USA'
      }
      }).then((customer) => {
        return stripe.charges.create({
        amount:7000,
        description: 'Web Development Product',
        currency: 'USD',
        customer: customer.id
        })
        })
        .then((charge) => {
          console.log(charge)
        res.send("Success")


        }).catch((err) => {
          res.render("user/ordersucess")
          })


          const orders= req.session.order

          // console.log(orders)
          const neworder = new Order (orders)
          const userid =  await user.findOne({email:req.session.email})
       
          const usercart = await cart.findOne({ userref:userid._id});
          if (usercart){  
          
            await cart.deleteOne({ userref: userid._id })
          
          }
await neworder.save()
// return res.redirect("/userhome/orders")


  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).send('Payment failed!');
  }
}





exports.cancelorderpost = async (req, res) => {
  const orderId = req.body.orderId;

  try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true });

      if (updatedOrder) {
         
          return res.status(200) .json({ message: 'Order updated successfully' });
      } else {
          return res.status(404).json({ error: 'Order not found' });
      }
  } catch (error) {
      console.error('Error cancelling order:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.ordergetdetails =async(req,res)=>{
try{
  if (req.session.email) {
    const user1 =await user.findOne({email:req.session.email})
  const orderid = req.query.orderid
const userorder = await Order.findOne({_id:orderid}).populate('products.product')
// console.log(userorder.products)
  res.render("user/orderoneshow",{user1:user1?user1:null, order:userorder,})
  }
else{

  res.redirect("/login")
}



}catch(err){

console.log(err)

}
}

let otpSent = false;
let passwordUpdated = false; 


exports.forgotpasswordget =async(req,res)=>{
  res.render('user/forgotpassword', { otpSent, passwordUpdated, error: req.flash('error') })




}
exports.forgotpasswordpost =async(req,res)=>{
const email = req.body.email

const finder = await user.findOne({email:email})


if(finder){
  const otp = generateOTP();
  console.log(otp)
          // Store OTP in session (you might want to use a more secure storage)
          req.session.otp = otp;
          req.session.email=email
  
          // Create a Nodemailer transporter
          let transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: "tomshift22@gmail.com",
                  pass: 'fblj qvtl mnsj yodt '
              }
          });
  
          // Set up email data
          let mailOptions = {
              from: 'tomshift22@gmail.com',
              to: email,
              subject: 'Email Verification OTP',
              text: `Your OTP for email verification is: ${otp}`
          };
  
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  res.send('Error sending email.');
              } else {
                  
              otpSent = true;
              }
          })

          otpSent = true;






  req.flash("error","otp send to ur "+email)
  res.redirect('/user/forgotpassword')

}else{

  req.flash("error","no emails were found")
  res.redirect('/user/forgotpassword')


}




}

exports.forgotpasswordotppost=async(req,res)=>{


if(req.body.otp==req.session.otp){

  passwordUpdated = true
delete req.session.otp
res.redirect("/user/forgotpassword")
}
else{
  passwordUpdated = false

  res.redirect("/user/forgotpassword")
}

}

exports.updatepasswordpost =async(req,res)=>{


const{newPassword, confirmPassword} = req.body
const email =req.session.email

if(newPassword==confirmPassword){

const finder = await user.findOne({email:email})
const encrypt = await bcrypt.hash(newPassword, 10)
finder.password=encrypt

finder.save()
delete req.session.email
res.redirect("/login")

}else{
req.flash("error","password doesnt match")
  res.redirect("/user/forgotpassword")

}




}