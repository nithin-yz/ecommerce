function deleteuser(username) {
  // Show confirmation dialog using SweetAlert
  Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
      if (result.isConfirmed) {
          // If user confirms deletion, send delete request
          fetch(`/adminhome/deleteuser/${username}`, { method: "post" })
              .then((res) => res.json())
              .then((data) => {
                  if (data) {
                      // If deletion is successful, show success message
                      Swal.fire(
                          'Deleted!',
                          'User has been deleted.',
                          'success'
                      );
                      // Reload the page after a delay
                      setTimeout(() => {
                          location.reload();
                      }, 1000);
                  } else {
                      // If deletion fails, show error message
                      Swal.fire(
                          'Error!',
                          'Failed to delete user.',
                          'error'
                      );
                  }
              });
      }
  });
}
