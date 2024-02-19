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
