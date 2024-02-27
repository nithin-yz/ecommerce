document.addEventListener('DOMContentLoaded', function() {
 
    const removeIcons = document.querySelectorAll('.remove-item-icon');
    removeIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            const index = (this.getAttribute('data-index'));
            console.log(index)
           removecart(index)
        });
    });





    
});

function removecart(index) {
    console.log("worked")
    fetch(`/userhome/removecartitem/${index}`,{method:'get'})
    .then((res)=>{

if(res.ok){

    window.location.reload()
}else{


    window.location.href='/login'
}


    }).catch((err)=>{

        console.log(err)
    })



}