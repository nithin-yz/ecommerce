
    document.getElementById('verificationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        
        fetch('/user/emailverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                otp: document.getElementById('otp').value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display SweetAlert for successful order placement
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully!',
                    text: 'Thank you for your order.',
                    timer: 3000,
                    timerProgressBar: true,
                    onClose: () => {
                        // Redirect to orders page
                        window.location.href = '/userhome/orders';
                    }
                });
            } else {
                // Display error message if OTP is incorrect
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'Please enter a valid OTP.',
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });