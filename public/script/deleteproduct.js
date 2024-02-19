function deleteuser(username) {
  // Show SweetAlert confirmation dialog
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
      if (result.isConfirmed) {
          // If user confirms, proceed with deletion
          fetch(`/adminhome/deleteproduct/${username}`)
              .then((res) => {
                  return res.json();
              })
              .then((data) => {
                  console.log(data);
                  if (data.success) {
                      // Show success message using SweetAlert
                      Swal.fire(
                          'Deleted!',
                          'Your product has been deleted.',
                          'success'
                      ).then(() => {
                          // Reload page after confirmation
                          location.reload();
                      });
                  } else {
                      // Show error message using SweetAlert
                      Swal.fire(
                          'Error!',
                          'Failed to delete product.',
                          'error'
                      );
                  }
              })
              .catch((error) => {
                  console.error('Error:', error);
                  // Show error message using SweetAlert
                  Swal.fire(
                      'Error!',
                      'Something went wrong.',
                      'error'
                  );
              });
      }
  });
}


function editproduct(productId) {
  // Redirect the user to the edit page with the product ID
  window.location.href = `/adminhome/edit/?productid=${productId}`;
}
