const mongoose =require("mongoose")
    const mongourl = "mongodb+srv://tomshift22:hmIIGiOuw7v8zKNe@bestbuy.zxclmeg.mongodb.net/?retryWrites=true&w=majority&appName=Bestbuy"

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