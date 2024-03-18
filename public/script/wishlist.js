


async function heart (id) {
const element = document.getElementById(id)
console.log(element)
fetch(`/userhome/wishlist/add/${id}`,{
   method:'post' 
})

.then(res=>{

console.log(res)
if(res.ok){

    console.log("worked")


if (element.innerHTML.includes('fa-solid fa-heart')) {
    element.innerHTML = '<i class="fa-regular fa-heart" style="color: #000;" onclick="heart(\'' + id + '\')"></i>';
} else {
    element.innerHTML = '<i class="fa-solid fa-heart" style="color: #f71346;" onclick="heart(\'' + id + '\')"></i>';
}




} else{
    
    window.location.href = '/login'
}


})




}


// async function cart (id) {
//     const element = id
//     console.log(element)
//     fetch(`/userhome/cart/add/${id}`,{
//        method:'get' 
//     })
    
//     .then(res=>{
    
//     console.log(res)
//     if(res.ok){
    
//         console.log("worked")
    
    
   
    
    
    
//     } else{
        
//         window.location.href = '/login'
//     }
    
    
//     })
    
    
    
//     }
   

async function cart(id) {
    const element = id;
 
    fetch(`/userhome/cart/add/${id}`, {
        method: 'get'
    })

    .then(res => {

        console.log(res);
        if (res.ok) {
            
            
          
            swal("Success!", "Product added to cart.", "success");
        } else {
            window.location.href = '/login';
        }
    });
}

