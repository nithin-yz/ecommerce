document.addEventListener('DOMContentLoaded', function() {
 
    const removeIcons = document.querySelectorAll('.remove-item-icon');
    removeIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            const index = (this.getAttribute('data-index'));
            console.log(index)
           removecart(index)
        });
    });





    
});

function removecart(index) {
    console.log("worked")
    fetch(`/userhome/removecartitem/${index}`,{method:'get'})
    .then((res)=>{

if(res.ok){

    window.location.reload()
}else{


    window.location.href='/login'
}


    }).catch((err)=>{

        console.log(err)
    })



}

document.addEventListener('DOMContentLoaded', function() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            const index = this.getAttribute('data-id');
            const newQuantity = parseInt(this.value);

            console.log(index);
            console.log(newQuantity);

            updateQuantity(index, newQuantity);
        });
    });

    function updateQuantity(index, newQuantity) {
        fetch('/userhome/cart/update/quantity', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: index, quantity: newQuantity })
        })
        .then(response => {
            if (response.ok) {
                // Update quantity in the UI without refreshing
                const subtotalCell = document.querySelector(`tr[data-index="${index}"] .subtotal-cell`);
                const priceCell = document.querySelector(`tr[data-index="${index}"] .price-cell`);

                // Calculate new subtotal
                const price = parseFloat(priceCell.innerText.replace('$', ''));
                const subtotal = price * newQuantity;

                // Update subtotal in the UI
                subtotalCell.innerText = '$' + subtotal.toFixed(2);
const totalElements = document.querySelectorAll('.subtotal-cell');
            let newTotal = 0;
            totalElements.forEach(element => {
                newTotal += parseFloat(element.innerText.replace('$', ''));
            });

            // Update total in the UI
            const cartTotalElement = document.getElementById('cart-subtotal');
            cartTotalElement.innerHTML = '<strong>$' + newTotal.toFixed(2) + '</strong>';

            const carttotal =  document.getElementById('cart-total')
            carttotal.innerHTML = '<strong>$' + newTotal.toFixed(2) + '</strong>';



            } else {
                throw new Error('Failed to update quantity in the database');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // You can handle the error here (e.g., show an error message to the user)
        });
    }
});





document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('inputField');

    // Listen for input event
    inputField.addEventListener('input', function(event) {
        const value = parseInt(event.target.value);

        // Check if value is less than or equal to 0
        if (value <= 0) {
            // Set input value to 1
            inputField.value = 1;
        }
    });
});