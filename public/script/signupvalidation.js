const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^\d{10}$/;


let emaillab = document.getElementById("emaillabel")
let phonelab =document.getElementById("phonelabel")
let passlab = document.getElementById("passlabel")
let confirmpasswordl=document.getElementById("confirmlabel")

//input fields taken here
const name1 = document.getElementById('username')
const email = document.getElementById('emailinput')
const phone = document.getElementById('phone')
const password =document.getElementById('passwordinput')
const confirmpassword = document.getElementById('confirmPassword')

email.onblur =()=>{

if(!(emailRegex.test(email.value))){

emaillab.textContent="invalidemail"
emaillab.style.color="red"

}else{

    emaillab.innerText="Email"
    emaillab.style.color="white"
}


}
phone.onblur =()=>{

if(!(phoneNumberRegex.test(phone.value))){
console.log("hi")
phonelab.textContent="invalid phone number"
phonelab.style.color="red"

}else{

    phonelab.innerText="Phone"
    phonelab.style.color="white"
}


}

password.onblur =()=>{
if(!passwordRegex.test(password.value)){
console.log("true")
passlab.textContent="Password must contain @Aa1"
passlab.style.color="red"



}else{
passlab.textContent="Password"
passlab.style.color="white"

}
}

confirmpassword.onblur=()=>{

if(!(password.value==confirmpassword.value)){
console.log(password.value==confirmpassword.value)
console.log(password.value)
console.log(confirmpassword.value)
confirmpasswordl.textContent="confirm password doesnt match "
confirmpasswordl.style.color="red"



}else{
 console.log("hi")
confirmpasswordl.innerHTML="confirm Password&nbsp;<i class='fa-solid fa-shield-check' style='color: #008080;'></i>"

confirmpasswordl.style.color="white"

}
}



