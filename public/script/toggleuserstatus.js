

async function toggleUserStatus(checkbox, userId) {
    // Determine the current status of the user
    const currentUserStatus = checkbox.checked ? 'Active' : 'Block';
console.log(currentUserStatus)
    // Determine the action to be performed based on the current status
    const action = currentUserStatus === 'Block' ? 'unblock' : 'block';
    console.log(action)

    // Generate the confirmation text based on the action
    const confirmationText = `Do you want to ${action} user?`;

    // Show SweetAlert confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: confirmationText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Toggle user status
            const status = checkbox.checked ? 'Block' : 'Active';

            try {
                // Send AJAX request to backend
                const response = await axios.post('/admin/updateuserstatus', {
                    userId: userId,
                    status: status
                });

                console.log(response.data)
                if (response.data.success) {
                    // Update the checkbox state and UI accordingly
                    checkbox.checked = !checkbox.checked;
                    // Optionally, update the UI further based on the status change
                    // For example, change the appearance of the checkbox or update other UI elements
                    // console.log('User status updated successfully:', response.data);
                    window.location.reload()
                } else {
                    // Display an error message if the status update failed
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update user status!'
                    });
                }
            } catch (error) {
                console.error(error); // Log error if request fails
                // Show an error message to the user
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while updating user status!'
                });
            }
        } else {
            // Reset checkbox state if user cancels the action
            checkbox.checked = !checkbox.checked;
        }
    });
}
