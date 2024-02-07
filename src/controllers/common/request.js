const loginget = async (req,res)=>{


res.render("user/login",{error:req.flash("error"),error1:req.flash("error1")})




}
const signupget = async (req,res)=>{


res.render("user/signup",{error:""})




}






module.exports ={loginget,signupget,}