const bcrypt = require("bcrypt");
const { user, product } = require("../../models/databaseschema");
const serviceID = "VAc66fc21c45c044d1ab1ccdfac90eab3c";
// const serviceID ="MG97f0b3d1d7e90d4569dfcea3323b08dc"
const accountID = "AC27dfaf6dc082030c3200209807da96fc";
const authToken = "342ec8950109dbcc43494e64689f300f";
const client = require("twilio")(accountID, authToken);

exports.userhomeget = async (req, res) => {
  try {
    const p = await product.find()
    res.render("user/userhome1", {products:p});
  } catch (err) {
    console.log(err);
  }
};


exports.loginpost = async(req,res) =>{

try{
const {email,password} =req.body

const findperson = await user.findOne({email:email})

if(findperson){

    const check = await bcrypt.compare(password,findperson.password)

    if(check){
req.session.email = email

if(findperson.verified == true){

res.status(200).redirect("/userhome")

}
const cell =findperson.phone 
res.status(200).redirect(`/signup/otp/${cell}`)



    }else{

      req.flash('error1'," incorrect login details ")
      res.redirect("/login")

    }

}
else{
req.flash('error1',"user doesnt exist please signup ")
    res.redirect("/login")
}

}catch(err){

console.log(err)


}




}
















exports.signuppost = async (req, res) => {
  try {
    const { username, email, phone, password, confirmpassword } = req.body;

    const encrypt = await bcrypt.hash(password, 10);

    const newuser = new user({
      username,
      email,
      phone,
      password: encrypt,
    });

 const p =   await newuser.save();
console.log(p)
if (p){
    // await client.verify.v2
    //   .services(serviceID)
    //   .verifications.create({
    //     to: `+91${phone}`,
    //     channel: "sms",
    //   })
    //   .catch((err) => console.log(err));

    res.redirect(`/signup/otp/${phone}`)}
  } catch (err) {
    console.log(err);
    res.flash('error', 'you are not signed yet')
    res.redirect("/signup")
  }
};

exports.otpget = async (req, res) => {
  try {
    const phone = req.params.id;


    await client.verify.v2
    .services(serviceID)
    .verifications.create({
      to: `+91${phone}`,
      channel: "sms",
    })
    .catch((err) => console.log(err));





    // console.log(phone)
    res.render("user/otp", { message: phone, error: req.flash("error") });
  } catch {}
};

exports.otppost = async (req, res) => {
  const phone = req.params.id;
  const { otp } = req.body;
  try {
    const re = await client.verify.v2.services(serviceID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    console.log("response under");
    console.log(re);

    const { status, valid } = re;
    console.log(status, valid);

  

    if (status == "approved" && valid == true) {
      let changing = await user.findOne({ phone: phone })
      await user.updateOne({phone},{$set:{
        verified:true}})
                                                          
      res.redirect("/login");
    } else if (status == 403) {
      req.flash("error", "number is not registered with twilio");
      res.redirect(`/signup/otp`);
    } else {
      console.log("hai");
      req.flash("error", "otp is incorrect");
      res.redirect(`/signup/otp`);
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "number is not registered with twilio");
    res.redirect(`/signup/otp`);
  }
};

exports.menget = async (req,res)=>{

res.render("user/men")


}
 
exports.womenget =async (req,res)=>{



res.status(200).render("user/women")



}

exports.profileget = async(req,res)=>{



res.render("user/profile",{person:"", person1:"", addresses:""})



}