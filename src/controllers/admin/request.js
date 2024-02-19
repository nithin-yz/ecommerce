const {user,product,userprofile, category}= require("../../models/databaseschema")


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
res.send("product saved sucessfully")

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









