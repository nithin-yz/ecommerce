

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







