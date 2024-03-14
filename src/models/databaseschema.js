const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  verified: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now
  },
  status:{type:String,
  default:"active"}
  
});

const productschema = mongoose.Schema({
  productname: { type: String, required: true },

  description: { type: String, required: true },

  image1: { type: String, required: true },

  image2: { type: String, required: true },

  image3: { type: String, required: true },
  

  category: { type: String, required: true },
  subcategory:{type:String, required:true},

  price: { type: Number, required: true },
  newprice: { type: Number,required:true },
  stock: {type:Number, required:true},
  createdAt: {
    type: Date,
    default: Date.now
  }

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

const userprofileschema = 
mongoose.Schema({
address:{type:String},
landmark:{type:String},
locality:{type:String},
pin:{type:String},
ref:{type:mongoose.Types.ObjectId}


})

const categoryschema = mongoose.Schema({

category:{type:String}
,
subcategory:{type:Array,
  required :true


},


})

const bannerSchema = new mongoose.Schema({
  bannername: {
      type: String,
      required: true
  },
  bannerimage: {
      type: String, // Assuming you're storing image URLs
      required: true
  },
  bannercontent: {
      type: String,
      required: true
  }
});

const couponSchema = new mongoose.Schema({
  code: {
      type: String,
      required: true,
     
  },
  expirydatetime: {
      type: Date,
      required: true
  },
  addedate: {
      type: Date,
      default: Date.now
  },
  priceabove: {
      type: Number,
      required: true,
      min: 0
  },
  offerprice: {
      type: Number,
      required: true,
      min: 0
  }
});




const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  address: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash-on-delivery', 'upi'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending',  'shipped', 'delivered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalamount:{
    type:Number,
    required:true
  }
});


const reviewschema = new mongoose.Schema({
  userid :{


    type:mongoose.Schema.Types.ObjectId,
  ref:'user'
  
  },
review :[{

  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product'
    },

rating:{
type:Number,



},comments:{

type:String

}


}



]



})





 






























 











const review1= mongoose.model('review',reviewschema,'review')
const Order = mongoose.model('Orders', orderSchema);
const coupon = mongoose.model('Coupon', couponSchema,'Coupon')
const user = mongoose.model("User", userschema, "User");
const product = mongoose.model("product", productschema, "product");
const cart = mongoose.model("cart", cartscheme,"cart");
const wishlist = mongoose.model("wishlist",wishscheme,"wishlist")
const userprofile = mongoose.model("userprofile",userprofileschema,"userprofile")
const category = mongoose.model("category", categoryschema, "category")
const banner =  mongoose.model("banner", bannerSchema, "banner")
module.exports = { user, product,cart,wishlist, userprofile ,category,banner,coupon, Order,review1};
