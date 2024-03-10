

document.addEventListener('DOMContentLoaded', function (){

const deletebuttons = document.querySelectorAll('.delete-btn')
console.log(deletebuttons)
deletebuttons.forEach(function (button){

button.addEventListener('click', function(event){

console.log(event.currentTarget)

const selectid =event.currentTarget.getAttribute('addressid')

fetch('/delete/address', {

method:'POST',
headers:{

'Content-Type':'application/json'


},
body:JSON.stringify({id:selectid})


}).then(response => {
if(response.ok){
console.log(response)
   const addressElement= document.getElementById(`${selectid}`)
   console.log(addressElement)
    addressElement.remove();

}else{

    console.log('failed to delete address')
}


})
.catch((error) =>{console.log(error)})

})



})





})





document.querySelectorAll('.edit-btn').forEach(function(editBtn) {
    editBtn.addEventListener('click', function(event) {
        // Get the parent span element containing the address details
        const addressContainer = event.currentTarget.parentElement;
        console.log(addressContainer)
        // Extract the address details frcom the text content
        const addressText = addressContainer.textContent.trim();
        console.log(addressText)
        const addressDetails = addressText.split(': ')[1].split(',');

        // Populate the edit form fields with the address details
        const editForm = document.getElementById('edit-address-form');
        editForm.querySelector('#address').value = addressDetails[0].trim();
        editForm.querySelector('#locality').value = addressDetails[2].trim();
        editForm.querySelector('#landmark').value = addressDetails[1].trim();
        editForm.querySelector('#pin').value = addressDetails[3].trim();

        // Display the edit form and blurred background
        editForm.style.display = 'block';
        document.querySelector('.blur-background').style.display = 'block';
    });
});

// JavaScript to handle cancel button click
document.getElementById('cancel-edit-btn').addEventListener('click', function() {
    // Hide the blurred background
    document.querySelector('.blur-background').style.display = 'none';
    // Hide the edit address form
    document.getElementById('edit-address-form').style.display = 'none';
});

// JavaScript to handle save button click
document.getElementById('save-address-btn').addEventListener('click', function() {
    // Get the updated address details from the form and update the address (you need to implement this part)
    // Hide the blurred background
    document.querySelector('.blur-background').style.display = 'none';
    // Hide the edit address form
    document.getElementById('edit-address-form').style.display = 'none';
});
