var mainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img");

smallImg[0].addEventListener("click", () =>{
    mainImg.src = smallImg[0].src;
})
smallImg[1].addEventListener("click", () =>{
    mainImg.src = smallImg[1].src;
})
smallImg[2].addEventListener("click", () =>{
    mainImg.src = smallImg[2].src;
})
// smallImg[3].addEventListener("click", () =>{
//     mainImg.src = smallImg[3].src;
// })

// usershowproduct.js

async function addcart(id) {
  fetch(`/userhome/cart/add/${id}`, {
      method: 'get'
  })
  .then(res => {
      console.log(res);
      if (res.ok) {
          console.log("worked");
          
          // Show SweetAlert message when product is added to cart
          swal("Success!", "Product added to cart.", "success");
      } else {
          window.location.href = '/login';
      }
  });
}


    const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");
if (bar) {
  bar.addEventListener("focus", () => {
    nav.classList.add("active");
  });
}
if (close) {
    close.addEventListener("focus", () => {
      nav.classList.remove("active");
    });
  }

