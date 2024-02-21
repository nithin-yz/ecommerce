

document.addEventListener("DOMContentLoaded", function() {
    // Find the form element
    const form = document.getElementById("uploadForm");

    // Find the submit button
    const submitButton = form.querySelector("button[type='submit']");

    // Add click event listener to the submit button
    submitButton.addEventListener("click", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Function to validate form inputs before submitting
        function validateForm() {
            const bannerName = document.getElementById("bannerName").value;
            const bannerImage = document.getElementById("bannerImage").value;
            const bannerContent = document.getElementById("bannerContent").value;

            // Check if any of the required fields are empty
            if (bannerName.trim() === "" || bannerImage.trim() === "" || bannerContent.trim() === "") {
                // Show SweetAlert indicating missing fields
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please fill in all the required fields!',
                });
                return false; // Prevent form submission
            }

            // Form inputs are valid, allow form submission
            return true;
        }

        // Validate form inputs before submitting
        if (!validateForm()) {
            return; // Stop further execution if validation fails
        }

        // Show SweetAlert message for uploading banner
        Swal.fire({
            title: 'Uploading Banner',
            html: 'Please wait while the banner is being uploaded...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simulate some delay to mimic the uploading process
        setTimeout(() => {
            // Hide the SweetAlert message
            Swal.close();

            // Submit the form
            form.submit();
        }, 1000); // Adjust the delay time as needed
    });
});



    // Populate the edit banner form with existing data
    function editBanner(bannerId) {
        // Get the banner item element
      
        const bannerItem = document.querySelector(`.banner-item[data-banner-id="${bannerId}"]`);
    console.log(bannerItem);
        // Get the name and content elements within the banner item
        const nameElement = bannerItem.querySelector('.banner-name');
        const contentElement = bannerItem.querySelector('.banner-content');






    
        // Extract the name and content values
        const name = nameElement.textContent.split(': ')[1];
        const content = contentElement.textContent.split(': ')[1];
 
        // Populate the form fields with the banner details
        document.getElementById("editBannerName").value = name;
        document.getElementById("editBannerContent").value = content;
        document.getElementById("bannerIdInput").value = bannerId
        console.log( document.getElementById("bannerIdInput").value)
        // Show the overlay
        document.getElementById("overlay").style.display = "block";
    }
    


function closeOverlay() {
    // Hide the overlay
    document.getElementById("overlay").style.display = "none";
}



function saveBanner() {

    const bannername = document.getElementById("editBannerName").value 
    const bannercontent =document.getElementById("editBannerContent").value 
    const inputimagefile =document.getElementById("editImageContent").files[0]
    const id = document.getElementById("bannerIdInput").value 
    
    const formData = new FormData();
    formData.append('bannername', bannername);
    formData.append('bannercontent',bannercontent);
    formData.append('imagefile', inputimagefile);
formData.append('obid', id)
console.log(formData)
fetch('/adminhome/updatebanner', {

method:'post',

body:formData})



.then(response => response.json())
.then(data => {
    if (data.success) {
        // If the update is successful, reload the page
        location.reload();
    } else {
        console.error('Error updating banner:', data.error);
        alert('Error updating banner. Please try again later.');
    }
})
.catch(error => {
    console.error('Network error:', error);
    alert('Network error. Please check your internet connection and try again.');
});





   
}


function deleteBanner(need){

const id = need

const parent = document.querySelector(`.banner-item[data-banner-id="${need}"]`)


    fetch(`/adminhome/deletebanner/?id=${need}`, {
        method: 'GET'
    })
    .then(res => {
    

return res.json()

    }).then((res)=>{


if(res.ok) {
    parent.remove() 
}

    })


    .catch(error => {
        console.error('Error:', error);
    });
}





