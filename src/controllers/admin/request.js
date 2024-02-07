const {user,product}= require("../../models/databaseschema")


exports.adminget =async (req,res)=>{




res.render("admin/adminhome")






}

exports.addproductsget =async(req,res)=>{




    res.render("admin/addproduct", {error:""})
}

exports.addproductpost = async(req,res)=>{

    const {productname,price,description,category,newprice,stock} =req.body
console.log(req.files)
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
stock


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