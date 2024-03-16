
function editCoupon(coupon) {
   
    if (typeof coupon === 'string') {
        coupon = JSON.parse(coupon);
    }
    const expiryDateTime = new Date(coupon.expirydatetime);
    const year = expiryDateTime.getFullYear();
    const month = String(expiryDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(expiryDateTime.getDate()).padStart(2, '0');
    const hours = String(expiryDateTime.getHours()).padStart(2, '0');
    const minutes = String(expiryDateTime.getMinutes()).padStart(2, '0');
    const formattedExpiryDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    document.getElementById("editCode").value = coupon.code;
    document.getElementById("editExpiryDateTime").value = formattedExpiryDateTime;
    document.getElementById("editPriceAbove").value = coupon.priceabove;
    document.getElementById("editOfferPrice").value = coupon.offerprice;
    const element = document.querySelector(".wanted")
   
    if (element) {
        element.setAttribute("buttonid", coupon._id);
    }

            const editFormOverlay = document.getElementById('editCouponForm');
            editFormOverlay.style.display = 'block';
        }
       



        function cancelEdit() {
            document.getElementById("editCouponForm").style.display = "none";
        }




        // Function to handle form submission
document.getElementById("editCouponFormInner").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target;
    
    const formData = new URLSearchParams(new FormData(form)).toString(); // Convert FormData to URL-encoded string
    console.log(formData)
    // Get the coupon ID from the Save button's data attribute
    const couponId = event.submitter.getAttribute('buttonid');
    console.log(couponId);
    // Send POST request to update coupon details
    fetch(`/adminhome/updatecoupon/${couponId}`, { // Example: '/update-coupon/123'
        method: 'POST',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    
    }) 
    .then(response => {
    
        if (response.ok) {
            
            window.location.reload();
        } else {
            // Handle errors if any
            console.log('Failed to update coupon');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



function  deleteCoupon(coupon) {

const id  = coupon

const coupondiv  = document.getElementById(id)


axios.delete(`/adminhome/deletecoupon/?id=${id}`)
.then(res => {
 if (res.status==200){
    console.log(res)
    coupondiv.remove();
 }else{

    console.log("something error")
 }
})


}






