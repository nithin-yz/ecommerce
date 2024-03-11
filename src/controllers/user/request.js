const bcrypt = require("bcrypt");
const { user, product, userprofile,banner,wishlist,cart,coupon,Order} = require("../../models/databaseschema");
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
const e = require("connect-flash");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
}




exports.userhomeget = async (req, res) => {
  try {
      const p = await product.find();
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
        console.log("hi")
          if (req.session.email) {
            console.log("worked")
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
              req.session.email = email;

              if (findperson.verified) {
                  // const userwishlist = await wishlist.findOne({ user: findperson._id });
                  req.session.user = findperson;
                  // req.session.userwishlist = userwishlist ? userwishlist.products : [];
                  return res.status(200).redirect('/userhome');
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

    const encrypt = await bcrypt.hash(password, 10);

    const newuser = new user({
      username,
      email,
      phone,
      password: encrypt,
    });

 const p =   await newuser.save();

if (p){
    // await client.verify.v2
    //   .services(serviceID)
    //   .verifications.create({
    //     to: `+91${phone}`,
    //     channel: "sms",
    //   })
    //   .catch((err) => console.log(err));

    res.redirect(`/signup/otp/${phone}`)}
  } catch (err) {
    console.log(err);
    res.flash('error', 'you are not signed yet')
    res.redirect("/signup")
  }
};

exports.otpget = async (req, res) => {
  try {
    const phone = req.params.id;


    await client.verify.v2
    .services(serviceID)
    .verifications.create({
      to: `+91${phone}`,
      channel: "sms",
    })
    .catch((err) => console.log(err));





    // console.log(phone)
    res.render("user/otp", { message: phone, error: req.flash("error") });
  } catch {}
};

exports.otppost = async (req, res) => {
  const phone = req.params.id;
  const { otp } = req.body;
  try {
    const re = await client.verify.v2.services(serviceID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    console.log("response under");
    console.log(re);

    const { status, valid } = re;
    console.log(status, valid);

  

    if (status == "approved" && valid == true) {
      let changing = await user.findOne({ phone: phone })
      await user.updateOne({phone},{$set:{
        verified:true}})
                                                          
      res.redirect("/login");
    } else if (status == 403) {
      req.flash("error", "number is not registered with twilio");
      res.redirect(`/signup/otp`);
    } else {
      console.log("hai");
      req.flash("error", "otp is incorrect");
      res.redirect(`/signup/otp`);
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "number is not registered with twilio");
    res.redirect(`/signup/otp`);
  }
};

exports.allproductget = async (req,res)=>{



const regex = new RegExp("men", 'i'); // Case-insensitive search
const p = await product.find({ $or: [{ category: regex },{ description: regex }] });

const banner1 = await banner.find();
      const user = req.session.user;
      const userId = user ? user._id : null; 
      const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
  

      const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;







res.render("user/allproducts",{

  products: p,
  user1: user,
  banner1: banner1,
  userwishlist: userwishlist ? userwishlist.products : [],
  Emptywishlist: Emptywishlist


})








}
 
exports.womenget =async (req,res)=>{



res.status(200).render("user/women")



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

 console.log(email,productid1)

const user1 = await user.findOne({email:email})


const user1id = user1._id

const userwishlist = await wishlist.findOne({user:user1id})
if (userwishlist){
console.log(userwishlist) 

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
  console.log(userid)
  const cartid =req.params.cartid
console.log(cartid)
const usercart = await cart.findOne({userref:userid})
console.log(usercart)
if(usercart){
console.log(usercart.items)
const updatedarray =usercart.items.filter((a)=>{
console.log(a._id)
console.log(a._id.toString()==cartid)
return a._id.toString()!==cartid
}
)

console.log(updatedarray)
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

exports.searchandget =async(req,res)=>{

// console.log(req.query)
const  query =req.query.query
const regex = new RegExp(query, 'i'); // Case-insensitive search
const p = await product.find({ $or: [{ productname: regex },{ description: regex },{category:regex}] });

const banner1 = await banner.find();
      const user = req.session.user;
      const userId = user ? user._id : null; 
      const userwishlist = await wishlist.findOne({ user: userId }).populate('products');
  

      const Emptywishlist = !userwishlist || !userwishlist.products || userwishlist.products.length === 0;







res.render("user/allproducts",{

  products: p,
  user1: user,
  banner1: banner1,
  userwishlist: userwishlist ? userwishlist.products : [],
  Emptywishlist: Emptywishlist


})

}

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
console.log("hai")
console.log(req.query)

if(req.session.email){
const finder = await user.findOne({email:req.session.email})  

const usercart = await cart.findOne({userref:finder._id})
console.log(usercart)

const Code  =req.query.code

const coupons = await coupon.find()
console.log(coupons)
const checker = coupons.find( (ele)=>{

return ele.code ==Code


}
  
  
  
  )

  console.log(checker)
if(checker){

const discount = checker.offerprice
const amountcheck= checker.priceabove

console.log(discount, amountcheck)

console.log(usercart.totalprice)

if(usercart.totalprice > amountcheck ) usercart.totalprice = usercart.totalprice -discount

usercart.save()

res.status(200).json({discount})

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
                pass: 'iiuk hazo paht ejte   '
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
  console.log(typeof(otp),typeof(storedOTP))
 console.log(Number(otp) === storedOTP)
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
console.log(amount)
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
          console.log(userid)
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
          console.log("hi");
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
  res.render("user/orderoneshow",{user1:user1?user1:null, order:userorder})
  }
else{

  res.redirect("/login")
}



}catch(err){

console.log(err)

}
}

