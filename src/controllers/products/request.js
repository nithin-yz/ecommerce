
const {user,product}= require("../../models/databaseschema")

exports.usershowproducts = async(req,res)=>{


try{
  const id  =req.params.id

const finder = await product.findById(id)
console.log(finder)

    res.render("user/showproduct", {element:finder})

}
catch (err){

console.log(err)

}





}
