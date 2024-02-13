const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  verified: { type: Boolean, default: false },
});

const productschema = mongoose.Schema({
  productname: { type: String, required: true },

  description: { type: String, required: true },

  image1: { type: String, required: true },

  image2: { type: String, required: true },

  image3: { type: String, required: true },
  

  category: { type: String, required: true },

  price: { type: Number, required: true },
  newprice: { type: Number,required:true },
});

const cartscheme = mongoose.Schema({
  userref: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  totalquantity: {
    type: Number,
    required: true,
    default: 0,
  },

  totalprice: {
    type: Number,
    required: true,
    default: 0,
  },
});

const wishscheme = mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:'user',
required:true


},

products:[{

type:mongoose.Schema.Types.ObjectId,
ref:"product"

}]





})

const userprofile = 
mongoose.Schema({
address:{type:String},
landmark:{type:String},
locality:{type:String},
pin:{type:String},
ref:{type:mongoose.Types.ObjectId}


})













user = mongoose.model("User", userschema, "User");
product = mongoose.model("product", productschema, "product");
cart = mongoose.model("cart", cartscheme,"cart");
wishlist = mongoose.model("wishlist",wishscheme,"wishlist")
module.exports = { user, product,cart,wishlist };
