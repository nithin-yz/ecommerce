function applycoupon(event) {
    // Get the coupon code from the input fieldx

    event.preventDefault();
    
    let couponCode = document.querySelector('.coupont').value;
let emptyelement = document.querySelector('.coupont')
    
    fetch(`/checkout/applycoupon?code=${couponCode}`, {
        method: 'GET'
      })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // Check if the coupon is applicable
        if (data.discount) {
            
            const discountAmount = data.discount; // Get the discount amount from the response
            
            // Update the total amount displayed on the frontend
            const totalElement = document.querySelector('.order-grand-total');
            const currentTotal = parseFloat(totalElement.textContent);
            const discountedTotal = currentTotal - discountAmount;
            
            // Display the discounted total amount
            totalElement.textContent = discountedTotal.toFixed(2); // Assuming two decimal places for currency
            
            // Update the discount amount displayed on the frontend
            document.querySelector('.table-discount').innerHTML = discountAmount;
            emptyelement.value =""
        } else {
            

            document.querySelector('.table-discount').innerHTML = data.invalidcoupon;
emptyelement.value =""
        }
    })
    .catch((error)=>{


        console.log( error);
    })
       
        // Handle error

};




//place order route 


const placeOrderBtn = document.getElementById('placeOrderBtn');
placeOrderBtn.addEventListener('click', async () => {
    // Validate the form
    const addressSelect = document.getElementById('addressSelect');
    console.log(addressSelect)
    const selectedAddress = addressSelect.value;
    console.log(selectedAddress)

    const paymentMethod = document.querySelector('input[name="radio"]:checked');
    // console.log(paymentMethod.value)
    if (!selectedAddress) {
        alert('Please select an address.');
        return;
    }else if (!paymentMethod) {
        console.log("hi")
        alert('Please select a payment method.');
        return;
    }else{

    try {
         fetch('/checkout/placeorder', {
            method: 'POST',
            body: JSON.stringify({
                address: selectedAddress,
                paymentMethod: paymentMethod.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        .then((res)=>{console.log(res)
        return res.json()}
        )

        .then(   (res)=>{   
            console.log(res)
    
            // Redirect to the appropriate payment page based on the payment method
            if (res == 'cash-on-delivery') {
              return  window.location.href = '/user/emailverify';
            } else if (res=='upi'){
               window.location.href = "/payment/razorpay"
            }
         else {
            console.log("error");
        }})
    } catch (error) {  
        console.log('Error placing order:', error);
    }
}
});



