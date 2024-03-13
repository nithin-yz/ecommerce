
const fs = require('fs')
const path= require('path')
const {product, category,coupon}= require("../../models/databaseschema")

exports.usershowproducts = async(req,res)=>{


try{

  
  const id  =req.params.id

const finder = await product.findById(id)
console.log(finder)

    res.render("user/showproduct", {product:finder})



}
catch (err){

console.log(err)

}





}

exports.addcategoryget =async(req,res)=>{

const categories = await category.find()

res.render("admin/addcategory",{category:categories, error:req.flash("error")})



}

exports.addcategorypost =async(req,res)=>{
try{
const {categoryname } = req.body
const names = await category.find({category:categoryname})

if (names.length > 0){

req.flash("error",'category already exists')
  return res.redirect("/adminhome/category",)


}
  
const cate = await new category ({

category:categoryname


})

await cate.save()

res.redirect("/adminhome/category")
}catch (err){

console.log(err)

}
  
  }

  exports.addsubcategorypost = async(req,res)=>{

const subcategory1 = req.body.subcategory
const main = req.body.category

const finder = await category.findOne({category:main})

const finderarray = finder.subcategory

finderarray.push(subcategory1)

await category.findByIdAndUpdate(finder._id, {category:finder.category, subcategory:finderarray})
res.redirect("/adminhome/category")

  }

  exports.deletecategory =async(req,res)=>{

    const obid= req.body.id
  
    const finder = await category.findByIdAndDelete(obid)
   
res.sendStatus(204)

  }

  exports.
  deletesubcategory =async(req,res)=>{
   try{ const obid= req.body.id
    const subcat = req.body.subcategory

    const finder = await category.findById(obid)

const updatedSubcategories = finder.subcategory.filter(sub => sub !== subcat);
finder.subcategory = updatedSubcategories;
await finder.save()

res.sendStatus(204)}catch{


  console.log("not updated subcategory array")
}

}

exports.editaproductget= async(req,res)=>{

  const productid = req.query.productid
  // console.log(productid)
  
  const finder =  await product.findById(productid)
  
  // console.log(finder)
  res.render("admin/editproduct", {product:finder})
  
  
  
  }
  



exports.editaproductpost = async (req, res) => {
    try {
        // Find the product by ID and update it
        const productid = req.query.productid;
        const existingProduct = await product.findById(productid);

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Define a function to delete old images
        const deleteOldImages = async (imageName) => {
            try {
              
              await fs.unlink(path.join(__dirname, "../../../public/uploads", imageName));

                console.log(`Deleted old image: ${imageName}`);
            } catch (error) {
                console.error(`Error deleting old image ${imageName}:`, error);
            }
        };

        // Remove existing images from the folder only if new images are uploaded
        if (existingProduct.image1 && req.files['image1'] && req.files['image1'].length > 0) {
            await deleteOldImages(existingProduct.image1);
        }
        if (existingProduct.image2 && req.files['image2'] && req.files['image2'].length > 0) {
            await deleteOldImages(existingProduct.image2);
        }
        if (existingProduct.image3 && req.files['image3'] && req.files['image3'].length > 0) {
            await deleteOldImages(existingProduct.image3);
        }

        // Update product with new data
        if (req.body.productname) existingProduct.productname = req.body.productname;
        if (req.body.price) existingProduct.price = req.body.price;
        if (req.body.description) existingProduct.description = req.body.description;
        if (req.body.category) existingProduct.category = req.body.category;
        if (req.body.newprice) existingProduct.newprice = req.body.newprice;
        if (req.body.stock) existingProduct.stock = req.body.stock;
        if (req.body.subcategory) existingProduct.subcategory = req.body.subcategory;

        if (req.files['image1'] && req.files['image1'].length > 0) {
            existingProduct.image1 = req.files['image1'][0].filename;
        }
        if (req.files['image2'] && req.files['image2'].length > 0) {
            existingProduct.image2 = req.files['image2'][0].filename;
        }
        if (req.files['image3'] && req.files['image3'].length > 0) {
            existingProduct.image3 = req.files['image3'][0].filename;
        }

        const updatedProduct = await existingProduct.save();

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.redirect("/adminhome/showproduct");
    } catch (error) {
        // Handle any errors
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

  






     exports.addcouponget = async (req,res)=>{
const coupons = await coupon.find()

res.render("admin/addcoupon" ,{coupons})

     }
  
    exports.addcouponpost = async(req,res)=>{

console.log(req.body)

const {expirydatetime,priceabove,offerprice,code}=req.body

const newcoupon = new coupon ({
  expirydatetime,priceabove,offerprice,code})

await newcoupon.save()

res.redirect("/adminhome/addcoupon")
    }
  

exports.updatecoupon =async(req,res)=>{
try{
const id = req.params.id

const datas = req.body
console.log(datas)

await coupon.findByIdAndUpdate(id,datas)

res.sendStatus(200)

}catch(err){


  console.log(err)
}
}

exports.  deletecoupon = async(req,res)=>{
try{
  const id = req.query.id
  console.log(id)
await coupon.findOneAndDelete(id)
res.sendStatus(200)
}catch(err){


console.log(err)

}
}