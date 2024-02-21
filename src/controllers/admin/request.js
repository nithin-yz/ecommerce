const {user,product,userprofile, category,banner}= require("../../models/databaseschema")
const fs = require('fs');
const path = require('path')


exports.adminget =async (req,res)=>{




res.render("admin/adminhome")






}

exports.addproductsget =async(req,res)=>{

const categories = await category.find()

const subcategories = categories.reduce(function(acc, element) {
    return acc.concat(element.subcategory);
}, []);




    res.render("admin/addproduct", {error:"", categories,})
}

exports.addproductpost = async(req,res)=>{

    const {productname,price,description,category,newprice,stock,subcategory} =req.body

const image1 = req.files['image1'][0].filename;
const image2 = req.files['image2'][0].filename;
const image3 = req.files['image3'][0].filename;

const newproduct = new product ({

productname,
price,
description,
image1,image2,image3,
category,
price,
newprice,
stock,
subcategory


})

await newproduct.save()
res.redirect("/adminhome")

}

exports.userlistget = async(req,res)=>{

list =await user.find()
    res.render("admin/userslist",{users:list})





}

exports.deleteuser = async (req,res)=>{

console.log(req.params)
const {id} =req.params
console.log(id)
const finder = await user.findByIdAndDelete(id)

console.log(finder)


if(finder){
console.log("true")
return res.json({sucess:true})

}else {

    res.send("error")
}
}

exports.showproductget = async (req,res)=>{

try{

    let prod = await product.find()
res.status(200).render("admin/showproduct",{product:prod})


}catch{



}




}


exports.deleteproduct =async(req,res)=>{

try{

    console.log(req.params)
    const {id} =req.params
    console.log(id)
    const finder = await product.findByIdAndDelete(id)
    if(finder){  
     
        console.log("true")
        // return res.send("true")
         res.json({success:true})}
        else{
 res.json({success:false})
            
        }

}catch(err){
console.log(err)


}






}

exports.addressdeletepost = async(req,res)=>{

const id =req.body.id
// console.log(req.body)
try{
const object = await userprofile.findById(id)
// console.log(object)
await userprofile.findByIdAndDelete(id)
res.sendStatus(204)

}catch (error){

console.error('delete error')
res.status(500).send('error deleting address');

}

}

exports.subcategoryload = async(req, res)=>{

try{

    
const selectedCat = req.body.selectedCat

const finder = await category.findOne({category:selectedCat})

const subcategories = finder.subcategory


if (subcategories) {
res.json({subcategories})}
 else{
console.log("error")

 }



}catch {

console.log("error happend somewhere whe taking subcategory")

}

}


exports.addbannerget = async(req,res)=>{
const banners = await banner.find()
res.render("admin/addbanner",{banners})




}

exports.addbannerpost = async(req, res) => {
    try {

        const bannername = req.body.bannername;
        const bannercontent = req.body.bannercontent;
        const bannerimage = req.file.filename;
        
        // Create new banner
        const newbanner = new banner({ bannername, bannerimage, bannercontent });
  
        await newbanner.save();
        
       
        res.redirect("/adminhome/addbanner");
    } catch (err) {
        
        console.log(err); // Redirect to admin home page even if an error occurs
    }
};
 



exports.deletebannerget = async(req,res)=>{

const id = req.query.id

const  finder  = await banner.findByIdAndDelete(id)
console.log(finder)

const filePath = path.join(__dirname, '..','..','..','public' ,'uploadbanner',  finder.bannerimage); 
console.log(filePath)

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            // return res.status(500).json({ error: "Internal server error" });
        }
        console.log('File deleted successfully');
    });



if (finder){


    res.json({"ok":"true"})
}else{

    res.json({"ok":"false"})

}


}

exports.bannerupdatepost = async (req, res) => {
    try {
        
        const id = req.body.obid;
        const bannername = req.body.bannername;
        const bannercontent = req.body.bannercontent;
        let bannerimage;

        if (req.file && req.file.filename) {
            bannerimage = req.file.filename;
          
            await banner.findByIdAndUpdate(id, { bannername, bannerimage, bannercontent });
        } else {
            await banner.findByIdAndUpdate(id, { bannername, bannercontent });
        }

        // Send a JSON response indicating success
        res.status(200).json({ success: true, message: "Banner updated successfully" });
    } catch (error) {
        console.error("Error updating banner:", error);
        // Send a JSON response indicating failure
        res.status(500).json({ success: false, error: "An error occurred while updating the banner" });
    }
};