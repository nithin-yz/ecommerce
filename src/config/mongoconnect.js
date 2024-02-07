const mongoose =require("mongoose")
const mongourl = "mongodb://localhost:27017/bestbuyecommerce"

const startmongoserver = async()=>{

try{

await mongoose.connect(mongourl)
console.log("Database is connected")


}
catch (err){

console.log("database is not connected")


}






}

module.exports = {startmongoserver}