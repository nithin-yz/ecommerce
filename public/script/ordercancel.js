function cancelOrder(orderId) {
    Swal.fire({
      title: 'Are you sure to cancel your order?',
      text: "You won't be able to reactivate this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Send POST request to cancel order
        fetch('/user/cancelorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ orderId: orderId })
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // Log the response data for debugging (optional)
  
          // Update UI on successful cancellation
          const cancelButton = document.querySelector(`button[data-order="${orderId}"]`);
          if (cancelButton) {
            cancelButton.remove();
          }
  
          const statusElement = document.querySelector(`p[data-order="${orderId}"]`);
          if (statusElement) {
            statusElement.textContent = 'Cancelled';
          }
  
          Swal.fire("Order Cancelled!", {
            icon: "success",
          });
        })
        
      } 
    });
  }
