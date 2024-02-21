const categoryDropdown = document.getElementById('category');
const subcategoryDropdown = document.getElementById('subcategory');

categoryDropdown.addEventListener('change', function() {
  const selectedCat = categoryDropdown.value;
  console.log(selectedCat)
  fetch('/adminhome/addproduct/categoryedit',{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({selectedCat}) })
    .then(response => response.json())
    .then(data => {
      subcategoryDropdown.innerHTML = '';    
      const emptyoption = document.createElement('option');
      emptyoption.value = "";
      emptyoption.textContent = "";
      subcategoryDropdown.appendChild(emptyoption)

      data.subcategories.forEach(subcategory => {
        const option = document.createElement('option');
        option.value = subcategory;
        option.textContent = subcategory;
        subcategoryDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching subcategories:', error);
    });
});

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Find the form element
  const form = document.getElementById("uploadForm");

  // Find the submit button
  const submitButton = form.querySelector("button[type='submit']");

  // Add click event listener to the submit button
  submitButton.addEventListener("click", function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Show SweetAlert message for uploading banner
      Swal.fire({
          title: 'Uploading Product',
          html: 'Please wait while the  new product is being uploaded...',
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading();
          }
      });

      // Delay form submission after 3 seconds (adjust as needed)
      setTimeout(function() {
          // Proceed with the form submission
          form.submit();
      }, 3000);
      
  });
});
