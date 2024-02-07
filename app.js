const express =require('express')
const app = express()
const session= require("express-session")
const flash = require("connect-flash")
const cache = require("nocache")
const env =require("dotenv")
const path =require("path")
app.use(flash());

env.config()

const PORT = process.env.PORT || 5001
const rash = process.env.SECRET
const {startmongoserver} =require("./src/config/mongoconnect")
startmongoserver()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(
session({
secret:rash,
resave:true,
saveUninitialized:false


})
)

app.use(express.static("public"))
const mainroute = require("./src/router/routing")
app.set("view engine", "ejs")
app.set("views", "./src/views")
app.use(cache())

app.use("/", mainroute)
app.listen(PORT,()=>{

    console.log("http://localhost:"+PORT+""+ " "+"serverstarted")
})


