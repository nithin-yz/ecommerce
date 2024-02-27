document.addEventListener('DOMContentLoaded', function() {
    const removeFromWishlistButtons = document.querySelectorAll('.removeFromWishlist');

    removeFromWishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');

            fetch(`/userhome/wishlist/remove/${productId}`, {
                method: 'GET', // Assuming your backend endpoint supports DELETE method
                headers: {
                    'Content-Type': 'application/json',
                    // You may need to include additional headers like authorization token
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Optionally, you can remove the item from the DOM after successful removal
                this.parentNode.remove(); // Removes the entire wishlist item div
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error scenarios, e.g., display an error message to the user
            });
        });
    });
});